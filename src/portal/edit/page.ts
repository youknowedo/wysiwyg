import {
    chosenElement,
    generateHierarchy,
    hoverElement,
    setChosenElement,
    setHoverElement,
} from "./edit.js";
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

export const pageToHtml = (page: Page): Node[] => {
    let body = document.createElement("body");

    for (const element of page.body) {
        body.appendChild(elementToHtml(element));
    }

    const html: Node[] = [];
    for (const child of body.childNodes) {
        html.push(child);
    }

    return html;
};

export const elementToHtml = <K extends keyof PageElementTypes>(
    element: PageElement<K>
): ChildNode => {
    if (elementIsText(element)) {
        const html = document.createElement(element.tag);
        html.id = element.id;
        html.innerHTML = element.value;
        html.setAttribute("wysiwyg", element.type);
        if (hoverElement == element) html.classList.add("hover");
        html.onclick = (e) => {
            e.preventDefault();
            if (chosenElement == element) return;

            setChosenElement(element);

            generateHierarchy();
        };

        if (element == chosenElement) {
            html.classList.add("chosen");
            html.setAttribute("contenteditable", "");
            html.oninput = () => {
                element.value = html.innerHTML;
            };
        }

        return html;
    } else if (elementIsContainer(element)) {
        const html = document.createElement("div");
        html.id = element.id;
        html.setAttribute("wysiwyg", element.type);
        if (hoverElement == element) html.classList.add("hover");
        html.onclick = (e) => {
            e.preventDefault();
            if (e.currentTarget != e.target) return;
            if (chosenElement == element) return;

            setChosenElement(element);

            generateHierarchy();
        };

        if (element == chosenElement) html.classList.add("chosen");

        for (const child of element.children) {
            html.appendChild(elementToHtml(child));
        }

        return html;
    } else {
        throw new Error("Element type wasn't recognized.");
    }
};
