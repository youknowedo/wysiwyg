import { AnyPageElement, Page, PageElement } from "./edit/elements.js";
import { hierarchyOnLoad, updateHierarchy } from "./edit/hierarchy.js";
import { htmlToPage, pageToHtml } from "./edit/page.js";
import { updateStylesInspector } from "./edit/stylesInspector.js";

// Get the slugs
const slugs = window.location.pathname.split("/");
// Remove the last slug if it's empty
slugs[slugs.length - 1] == "" && slugs.pop();
// Get the slug
export const slug = slugs[slugs.length - 1];

// Get the iframe document
const iframe = document.getElementById("page") as HTMLIFrameElement;
const doc = iframe.contentDocument;
if (!doc) throw new Error("IFrame document not found");

const saveButton = document.getElementById("saveButton") as HTMLButtonElement;

export type EditMaster = {
    page: Page;
    selectedElement: AnyPageElement | undefined;
    hoverElement: AnyPageElement | undefined;
};
// The edit master. This is the object that contains all the data for the editor
const editMaster: EditMaster = {
    page: htmlToPage(doc.body.innerHTML),
    selectedElement: undefined,
    hoverElement: undefined,
};

export const updateEditor = (cover: "full" | "elementsOnly") => {
    updateHierarchy(editMaster);
    updateIFrame();

    if (cover == "full") updateStylesInspector(editMaster);
};

// Update the iframe
const updateIFrame = () => {
    // Clear the iframe
    doc.body.innerHTML = "";

    // Append the page to the iframe
    doc.body.append(...pageToHtml(editMaster));

    // Add the iframe stylesheet if it doesn't exist
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

const onLoad = () => {
    saveButton.onclick = async (e) => {
        saveButton.disabled = true;

        // Add all of the elements into a new body
        const body = document.createElement("body");
        body.append(
            ...pageToHtml({
                selectedElement: undefined,
                hoverElement: undefined,
                page: editMaster.page,
            })
        );

        // Send the request
        await fetch(window.location.pathname, {
            method: "POST",
            body: body.innerHTML,
        });

        saveButton.disabled = false;
    };

    doc.body.onclick = (e) => {
        if (e.currentTarget != e.target) return;

        // If the user clicked on the body, deselect the selected element
        editMaster.selectedElement = undefined;
        editMaster.hoverElement = undefined;

        updateEditor("full");
    };

    hierarchyOnLoad(editMaster);

    updateEditor("full");
};
onLoad();
