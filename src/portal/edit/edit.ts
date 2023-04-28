import { PageElementTypes, elementIsContainer } from "./elements.js";
import { PageElement, htmlToPage, pageToHtml, type Page } from "./page.js";

const db = await fetch("/temp_database.json").then((res) => res.json());
const slugs = window.location.pathname.split("/");
const slug = slugs[slugs.length - 1];

const iframe = document.getElementById("page") as HTMLIFrameElement;
const page = htmlToPage(db[slug]);

let chosenElement: PageElement | undefined = undefined;

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
    text.onclick = (e) => {
        e.preventDefault();

        chosenElement = element;

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
const generateHierarchy = () => {
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
    doc.body.append(...pageToHtml(page, chosenElement));

    const css = doc.createElement("link");
    css.href = "/styles/portal/edit/iframe.css";
    css.rel = "stylesheet";
    css.type = "text/css";
    doc.head.appendChild(css);
};

generateHierarchy();

const saveButton = document.getElementById("saveButton");
if (saveButton)
    saveButton.onclick = (e) => {
        e.preventDefault();
        console.log("saving");

        const body = document.createElement("body");
        body.append(...pageToHtml(page));

        fetch(window.location.pathname, {
            method: "POST",
            body: body.innerHTML,
        });
    };
