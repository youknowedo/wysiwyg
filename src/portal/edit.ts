import { generateHierarchy } from "./edit/hierarchy.js";
import { PageElement, htmlToPage, pageToHtml, type Page } from "./edit/page.js";
import { generateStylesInspector } from "./edit/styles.js";

const slugs = window.location.pathname.split("/");
slugs[slugs.length - 1] == "" && slugs.pop();
export const slug = slugs[slugs.length - 1];

const iframe = document.getElementById("page") as HTMLIFrameElement;
const doc = iframe.contentDocument;

export type EditMaster = {
    page: Page;
    chosenElement: PageElement | undefined;
    hoverElement: PageElement | undefined;
};
const editMaster: EditMaster = {
    page: htmlToPage(doc!.body.innerHTML),
    chosenElement: undefined,
    hoverElement: undefined,
};

const generateIFrame = () => {
    if (!doc) throw new Error("iframe missing doc");

    doc.body.innerHTML = "";
    doc.body.append(...pageToHtml(editMaster));
    doc.body.onclick = (e) => {
        if (e.currentTarget != e.target) return;

        editMaster.chosenElement = undefined;

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
    generateHierarchy(editMaster);
    generateIFrame();
    generateStylesInspector(editMaster);
};

const saveButton = document.getElementById(
    "saveButton"
) as HTMLButtonElement | null;
if (saveButton)
    saveButton.onclick = async (e) => {
        e.preventDefault();
        saveButton.disabled = true;

        const body = document.createElement("body");
        body.append(...pageToHtml(editMaster));

        await fetch(window.location.pathname, {
            method: "POST",
            body: body.innerHTML,
        });

        saveButton.disabled = false;
    };

render();
