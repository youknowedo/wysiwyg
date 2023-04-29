import { PageElementTypes, elementIsContainer } from "./elements.js";
import { PageElement, htmlToPage, pageToHtml, type Page } from "./page.js";

const db = await fetch("/temp_database.json").then((res) => res.json());
const slugs = window.location.pathname.split("/");
slugs[slugs.length - 1] == "" && slugs.pop();
const slug = slugs[slugs.length - 1];

const iframe = document.getElementById("page") as HTMLIFrameElement;
const page = htmlToPage(db[slug]);

export let chosenElement: PageElement | undefined = undefined;
export const setChosenElement = (e: PageElement | undefined) =>
    (chosenElement = e);
export let hoverElement: PageElement | undefined = undefined;
export const setHoverElement = (e: PageElement | undefined) =>
    (hoverElement = e);

const generateHierarchyElement = <K extends keyof PageElementTypes>(
    element: PageElement<K>,
    level = 0
) => {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("wysiwyg", element.type);
    wrapper.classList.add("isElement");

    const text = wrapper.appendChild(document.createElement("span"));
    text.innerText = element.type;
    if (element == chosenElement) text.classList.add("chosen");
    if (element == hoverElement) text.classList.add("hover");
    text.onclick = (e) => {
        e.preventDefault();

        chosenElement = element;

        generateHierarchy();
    };
    text.onmouseenter = (e) => {
        e.preventDefault();
        if (e.currentTarget != e.target) return;
        if (hoverElement == element) return;

        hoverElement = element;

        generateHierarchy();
    };
    text.onmouseleave = (e) => {
        e.preventDefault();
        if (e.currentTarget != e.target) return;
        hoverElement = undefined;

        generateHierarchy();
    };

    if (elementIsContainer(element)) {
        if (!element.children) element.children = [];

        for (const child of element.children) {
            wrapper.appendChild(generateHierarchyElement(child, level + 1));
        }

        const newButton = wrapper.appendChild(document.createElement("button"));
        newButton.innerText = "+";
        newButton.classList.add("newButton");
        newButton.onclick = (e) => {
            e.preventDefault();

            if (!element.children) element.children = [];
            element.children.push({
                id: "",
                type: "container",
                children: [],
            } as PageElement<"container">);

            generateHierarchy();
        };
    }

    return wrapper;
};

const hierarchy = document.querySelector<HTMLElement>("#editor>div.left");
if (hierarchy)
    hierarchy.onclick = (e) => {
        e.preventDefault();
        if (e.currentTarget != e.target) return;

        chosenElement = undefined;

        generateHierarchy();
    };
export const generateHierarchy = () => {
    if (!hierarchy) throw new Error("Hierarchy doesn't exist");

    hierarchy.innerHTML = "";

    const wrapper = hierarchy.appendChild(document.createElement("div"));
    wrapper.setAttribute("wysiwyg", "container");

    const text = wrapper.appendChild(document.createElement("span"));
    text.innerText = slug;

    for (const element of page.body) {
        wrapper.appendChild(generateHierarchyElement(element, 0));
    }

    const newButton = wrapper.appendChild(document.createElement("button"));
    newButton.innerText = "+";
    newButton.classList.add("newButton");
    newButton.onclick = (e) => {
        e.preventDefault();

        page.body.push({
            id: "",
            type: "container",
            children: [],
        } as PageElement<"container">);

        generateHierarchy();
    };

    generateIFrame();
};

const generateIFrame = () => {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("iframe missing doc");

    doc.body.innerHTML = "";
    doc.body.append(...pageToHtml(page));
    doc.body.onclick = (e) => {
        if (e.currentTarget != e.target) return;

        chosenElement = undefined;

        generateHierarchy();
    };

    const css = doc.createElement("link");
    css.href = "/styles/portal/edit/iframe.css";
    css.rel = "stylesheet";
    css.type = "text/css";
    doc.head.appendChild(css);
};

generateHierarchy();

const saveButton = document.getElementById(
    "saveButton"
) as HTMLButtonElement | null;
if (saveButton)
    saveButton.onclick = async (e) => {
        e.preventDefault();
        saveButton.disabled = true;

        const body = document.createElement("body");
        body.append(...pageToHtml(page));

        await fetch(window.location.pathname, {
            method: "POST",
            body: body.innerHTML,
        });

        saveButton.disabled = false;
    };
