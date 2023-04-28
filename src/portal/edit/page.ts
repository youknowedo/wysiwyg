import {
    PageElementTextTag,
    PageElementTypes,
    elementIsContainer,
    elementIsText,
} from "./elements.js";

export type Page = {
    body: PageElement[];
};

export type PageElement<K extends keyof PageElementTypes = any> = {
    type: K;
} & PageElementTypes[K];

export const htmlToPage = (html: string): Page => {
    const body: PageElement[] = [];

    const htmlBody = document.createElement("body");
    htmlBody.innerHTML = html;

    for (const child of htmlBody.children) {
        body.push(htmlToPageElement(child));
    }

    return {
        body,
    };
};

export const htmlToPageElement = (html: Element): PageElement => {
    const type = html.attributes.getNamedItem("wysiwyg")
        ?.value as keyof PageElementTypes;

    if (type == "text") {
        const element: PageElement<"text"> = {
            type,
            id: html.id,
            tag: html.tagName.toLowerCase() as PageElementTextTag,
            value: html.innerHTML,
        };

        return element;
    } else if (type == "container") {
        const children: PageElement[] = [];

        for (const child of html.children) {
            children.push(htmlToPageElement(child));
        }

        const element: PageElement<"container"> = {
            type,
            id: html.id,
            children,
        };

        return element;
    }
};

export const pageToHtml = (page: Page, chosenElement?: PageElement): Node[] => {
    let body = document.createElement("body");

    for (const element of page.body) {
        body.appendChild(elementToHtml(element, chosenElement));
    }

    const html: Node[] = [];
    for (const child of body.childNodes) {
        html.push(child);
    }

    return html;
};

export const elementToHtml = <K extends keyof PageElementTypes>(
    element: PageElement<K>,
    chosenElement?: PageElement<K>
): ChildNode => {
    if (element.type == "text" && elementIsText(element)) {
        const html = document.createElement(element.tag);
        html.id = element.id;
        html.innerHTML = element.value;
        html.setAttribute("wysiwyg", element.type);

        if (element == chosenElement) {
            html.classList.add("chosen");
            html.setAttribute("contenteditable", "true");
            html.oninput = (e) => {
                element.value = html.innerHTML;
            };
        }

        return html;
    } else if (element.type == "container" && elementIsContainer(element)) {
        const html = document.createElement("div");
        html.id = element.id;
        html.setAttribute("wysiwyg", element.type);

        if (element == chosenElement) html.classList.add("chosen");

        for (const child of element.children) {
            html.appendChild(elementToHtml(child, chosenElement));
        }

        return html;
    } else {
        throw new Error("Element type wasn't recognized.");
    }
};
