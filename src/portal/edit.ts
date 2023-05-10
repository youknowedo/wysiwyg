import { generateHierarchy } from "./edit/hierarchy.js";
import { PageElement, htmlToPage, pageToHtml, type Page } from "./edit/page.js";

const db = await fetch("/temp_database.json").then((res) => res.json());

const slugs = window.location.pathname.split("/");
slugs[slugs.length - 1] == "" && slugs.pop();
export const slug = slugs[slugs.length - 1];

const iframe = document.getElementById("page") as HTMLIFrameElement;
export const page = htmlToPage(db[slug]);

export let chosenElement: PageElement | undefined = undefined;
export const setChosenElement = (e: PageElement | undefined) =>
    (chosenElement = e);
export let hoverElement: PageElement | undefined = undefined;
export const setHoverElement = (e: PageElement | undefined) =>
    (hoverElement = e);

const generateIFrame = () => {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("iframe missing doc");

    doc.body.innerHTML = "";
    doc.body.append(...pageToHtml(page));
    doc.body.onclick = (e) => {
        if (e.currentTarget != e.target) return;

        chosenElement = undefined;

        render();
    };

    if (
        !doc.querySelector('head>link[href="/styles/portal/edit/iframe.css"]')
    ) {
        const css = doc.createElement("link");
        css.href = "/styles/portal/edit/iframe.css";
        css.rel = "stylesheet";
        css.type = "text/css";
        doc.head.appendChild(css);
    }
};

export const render = () => {
    generateHierarchy();
    generateIFrame();
};

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

render();
