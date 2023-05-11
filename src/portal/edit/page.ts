import { EditMaster, render } from "../edit.js";
import {
    PageElementTextTag,
    PageElementTypes,
    elementIsContainer,
    elementIsText,
} from "./elements.js";
import { FlexAlignJustify, FlexDirection } from "./styles/layout.js";

export type Page = {
    body: PageElement[];
};

export type PageElement<K extends keyof PageElementTypes = any> = {
    type: K;
    parent?: PageElement<"container">;
} & PageElementTypes[K];

export const htmlToPage = (html: string): Page => {
    const body: PageElement[] = [];

    const htmlBody = document.createElement("body");
    htmlBody.innerHTML = html;

    for (const child of htmlBody.children) {
        body.push(htmlToPageElement(child as HTMLElement));
    }

    return {
        body,
    };
};

export const htmlToPageElement = (
    html: HTMLElement,
    parent?: PageElement<"container">
): PageElement => {
    const type = html.attributes.getNamedItem("wysiwyg")
        ?.value as keyof PageElementTypes;

    if (type == "text") {
        const element: PageElement<"text"> = {
            type,
            parent,
            id: html.id,
            tag: html.tagName.toLowerCase() as PageElementTextTag,
            value: html.innerHTML,
            styles: {},
        };

        return element;
    } else if (type == "container") {
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
                            (html.style.justifyContent as FlexAlignJustify) ||
                            "flex-start",
                    },
                },
            },
        };

        for (const child of html.children) {
            element.children.push(
                htmlToPageElement(child as HTMLElement, element)
            );
        }

        return element;
    }
};

export const pageToHtml = (editMaster: EditMaster): Node[] => {
    let body = document.createElement("body");

    for (const element of editMaster.page.body) {
        body.appendChild(elementToHtml(element, editMaster));
    }

    const html: Node[] = [];
    for (const child of body.childNodes) {
        html.push(child);
    }

    return html;
};

export const elementToHtml = <K extends keyof PageElementTypes>(
    element: PageElement<K>,
    editMaster: EditMaster
): ChildNode => {
    if (elementIsText(element)) {
        const html = document.createElement(element.tag);
        html.id = element.id;
        html.innerHTML = element.value;
        html.setAttribute("wysiwyg", element.type);
        if (editMaster.hoverElement == element) html.classList.add("hover");
        html.onclick = (e) => {
            e.preventDefault();
            if (editMaster.chosenElement == element) return;

            editMaster.chosenElement = element;

            let parent = element.parent;
            while (parent != undefined) {
                parent.hierarchyOpen = true;
                parent = parent.parent;
            }

            render();
        };

        if (element == editMaster.chosenElement) {
            html.classList.remove("hover");
            html.classList.add("chosen");
            html.setAttribute("contenteditable", "");
            html.oninput = () => {
                element.value = html.innerHTML;
            };
        } else {
            if (editMaster.hoverElement == undefined) {
                html.onmouseenter = (e) => {
                    if (e.target != e.currentTarget) return;

                    editMaster.hoverElement = element;

                    render();
                };
            }
            html.onmouseleave = (e) => {
                if (e.target != e.currentTarget) return;

                editMaster.hoverElement = undefined;

                render();
            };
        }

        return html;
    } else if (elementIsContainer(element)) {
        const html = document.createElement("div");
        html.id = element.id;
        html.setAttribute("wysiwyg", element.type);
        if (editMaster.hoverElement == element) html.classList.add("hover");
        html.onclick = (e) => {
            e.preventDefault();
            if (e.currentTarget != e.target) return;
            if (editMaster.chosenElement == element) return;

            editMaster.hoverElement = undefined;
            editMaster.chosenElement = element;

            render();
        };

        if (element == editMaster.chosenElement) html.classList.add("chosen");
        else if (editMaster.hoverElement == undefined) {
            html.onmouseenter = (e) => {
                if (e.target != e.currentTarget) return;

                editMaster.hoverElement = element;

                render();
            };
        }
        html.onmouseleave = (e) => {
            if (e.target != e.currentTarget) return;

            editMaster.hoverElement = undefined;

            render();
        };

        for (const child of element.children) {
            html.appendChild(elementToHtml(child, editMaster));
        }

        html.style.flexDirection = element.styles.layout.flexItems.direction;
        html.style.alignItems = element.styles.layout.flexItems.align;
        html.style.justifyContent = element.styles.layout.flexItems.justify;

        return html;
    } else {
        throw new Error("Element type wasn't recognized.");
    }
};
