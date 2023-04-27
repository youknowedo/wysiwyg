import { PageElement, htmlToPage, pageToHtml, type Page } from "./page.js";

const db = await fetch("/temp_database.json").then((res) => res.json());

const iframe = document.getElementById("page") as HTMLIFrameElement;
const page = htmlToPage(db.home);

let chosenElement: PageElement | undefined = undefined;

const generateHierarchyElement = (element: PageElement, level = 0) => {
    const wrapper = document.createElement("div");

    const text = wrapper.appendChild(document.createElement("span"));
    text.innerText = typeof element == "string" ? "Text" : element.type;
    if (element == chosenElement) text.classList.add("chosen");
    text.onclick = (e) => {
        e.preventDefault();

        chosenElement = element;

        generateHierarchy();
    };

    wrapper.classList.add(`${level}`);
    if (typeof element != "string") {
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
                type: "div",
                attributes: {},
            });

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
