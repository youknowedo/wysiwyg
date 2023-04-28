import { PageElementTypes, elementIsContainer } from "./elements.js";
import { PageElement, htmlToPage, pageToHtml, type Page } from "./page.js";

const db = await fetch("/temp_database.json").then((res) => res.json());

const iframe = document.getElementById("page") as HTMLIFrameElement;
const page = htmlToPage(db.home);

let chosenElement: PageElement | undefined = undefined;

const generateHierarchyElement = <K extends keyof PageElementTypes>(
    element: PageElement<K>,
    level = 0
) => {
    const wrapper = document.createElement("div");

    const text = wrapper.appendChild(document.createElement("span"));
    text.innerText = element.type;
    if (element == chosenElement) text.classList.add("chosen");
    text.onclick = (e) => {
        e.preventDefault();

        chosenElement = element;

        generateHierarchy();
    };

    if (element.type == "container" && elementIsContainer(element)) {
        wrapper.classList.add("isElement");

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

const hierarchy = document.getElementById("left");
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
    for (const element of page.body) {
        hierarchy.appendChild(generateHierarchyElement(element, 0));
    }

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

        fetch("/portal/edit/home", {
            method: "POST",
            body: body.innerHTML,
        });
    };
