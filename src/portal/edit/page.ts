import { EditMaster, updateEditor } from "../edit.js";
import {
    AnyPageElement,
    Page,
    PageElement,
    PageElementTextTag,
    PageElementTypes,
    elementIsContainer,
    elementIsText,
} from "./elements.js";
import {
    FlexAlignJustify,
    FlexDirection,
} from "./stylesInspector/types/layout.js";

// Converts an HTML string to a Page object
export const htmlToPage = (html: string): Page => {
    const body: AnyPageElement[] = [];

    const htmlBody = document.createElement("body");
    htmlBody.innerHTML = html;

    // Convert each child of the body to a PageElement
    for (const child of htmlBody.children) {
        body.push(htmlToPageElement(child as HTMLElement));
    }

    return {
        body,
    };
};

// Converts an HTML element to a PageElement
export const htmlToPageElement = (
    html: HTMLElement,
    parent?: PageElement<"container">
): AnyPageElement => {
    // Get the type of the element
    const type = html.attributes.getNamedItem("wysiwyg")
        ?.value as keyof PageElementTypes;

    switch (type) {
        case "text":
            return {
                type,
                parent,
                id: html.id,
                tag: html.tagName.toLowerCase() as PageElementTextTag,
                value: html.innerHTML,
                styles: {},
            } as PageElement<"text">;

        case "container":
            const element: PageElement<"container"> = {
                type,
                id: html.id,
                children: [],
                parent,
                hierarchyOpen: false,
                styles: {
                    layout: {
                        flexItems: {
                            direction:
                                (html.style.flexDirection as FlexDirection) ||
                                "column",
                            align:
                                (html.style.alignItems as FlexAlignJustify) ||
                                "flex-start",
                            justify:
                                (html.style
                                    .justifyContent as FlexAlignJustify) ||
                                "flex-start",
                        },
                    },
                    backgroundColor: html.style.backgroundColor || "",
                },
            };

            for (const child of html.children) {
                element.children.push(
                    htmlToPageElement(child as HTMLElement, element)
                );
            }

            return element;

        default:
            throw new Error("Element type not recognized");
    }
};

// Converts a Page object to a Node array
export const pageToHtml = (editMaster: EditMaster): Node[] => {
    let body = document.createElement("body");

    // Convert each element to HTML
    for (const element of editMaster.page.body) {
        body.appendChild(elementToHtml(element, editMaster));
    }

    // Convert the body to an array of nodes
    const html: Node[] = [];
    for (const child of body.childNodes) {
        html.push(child);
    }

    return html;
};

// Converts a PageElement to an HTML element
export const elementToHtml = <K extends keyof PageElementTypes>(
    element: PageElement<K>,
    editMaster: EditMaster
): ChildNode => {
    if (elementIsText(element)) {
        // Create the HTML element
        const html = document.createElement(element.tag);
        html.id = element.id;
        html.innerHTML = element.value;
        html.setAttribute("wysiwyg", element.type);

        // If the element is hovered, add the hover class
        if (editMaster.hoverElement == element) html.classList.add("hover");

        // When the element is clicked, select it
        html.onclick = (e) => {
            if (e.target != e.currentTarget) return;

            // If the element is already selected, return
            if (editMaster.selectedElement == element) return;

            editMaster.hoverElement = undefined;
            editMaster.selectedElement = element;

            // Open the hierarchy to the selected element
            let parent = element.parent;
            while (parent != undefined) {
                parent.hierarchyOpen = true;
                parent = parent.parent;
            }

            updateEditor("full");
        };

        if (element == editMaster.selectedElement) {
            // If the element is selected, add the selected class and make it editable
            html.classList.remove("hover");
            html.classList.add("selected");
            html.setAttribute("contenteditable", "");
            html.oninput = () => {
                element.value = html.innerHTML;
            };
        } else {
            if (editMaster.hoverElement == undefined) {
                // If no element is hovered, make this the hovered element on mouse enter
                html.onmouseenter = (e) => {
                    if (e.target != e.currentTarget) return;

                    editMaster.hoverElement = element;

                    updateEditor("elementsOnly");
                };
            }
            if (editMaster.hoverElement == element) {
                // If the element is hovered, remove the hover class on mouse leave
                html.onmouseleave = (e) => {
                    if (e.target != e.currentTarget) return;

                    editMaster.hoverElement = undefined;

                    updateEditor("elementsOnly");
                };
            }
        }

        return html;
    } else if (elementIsContainer(element)) {
        // Create the HTML element
        const html = document.createElement("div");
        html.id = element.id;
        html.setAttribute("wysiwyg", element.type);

        // If the element is hovered, add the hover class
        if (editMaster.hoverElement == element) html.classList.add("hover");

        // When the element is clicked, select it
        html.onclick = (e) => {
            e.preventDefault();
            if (e.currentTarget != e.target) return;
            if (editMaster.selectedElement == element) return;

            editMaster.hoverElement = undefined;
            editMaster.selectedElement = element;

            updateEditor("full");
        };

        if (element == editMaster.selectedElement)
            // If the element is selected, add the selected class
            html.classList.add("selected");
        else if (editMaster.hoverElement == undefined) {
            // If no element is hovered, make this the hovered element on mouse enter
            html.onmouseenter = (e) => {
                if (e.target != e.currentTarget) return;

                editMaster.hoverElement = element;

                updateEditor("elementsOnly");
            };
        }
        if (editMaster.hoverElement == element) {
            // If the element is hovered, remove the hover class on mouse leave
            html.onmouseleave = (e) => {
                if (e.target != e.currentTarget) return;

                editMaster.hoverElement = undefined;

                updateEditor("elementsOnly");
            };
        }

        // Convert each child to HTML
        for (const child of element.children) {
            html.appendChild(elementToHtml(child, editMaster));
        }

        // Add the flex styles
        html.style.flexDirection = element.styles.layout.flexItems.direction;
        html.style.alignItems = element.styles.layout.flexItems.align;
        html.style.justifyContent = element.styles.layout.flexItems.justify;

        // Add background styles
        html.style.backgroundColor = element.styles.backgroundColor;

        return html;
    } else throw new Error("Element type wasn't recognized.");
};
