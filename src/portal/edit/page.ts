export type Page = {
    body: PageElement[];
};

export type PageElement<T = unknown> =
    | {
          type: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | string;
          attributes?: {
              id?: string;
              [key: string]: string | undefined;
          };
          children?: PageElement[];
      }
    | string;

export const htmlToPage = (html: string): Page => {
    const body: PageElement[] = [];

    const HtmlBody = document.createElement("body");
    HtmlBody.innerHTML = html;
    HtmlBody.childNodes.forEach((node, i) => {
        body.push(
            nodeToPageElement(
                node.nodeType == 1 && node.parentElement
                    ? node.parentElement.children[i]
                    : node
            )
        );
    });

    return {
        body,
    };
};

export const isElement = (maybeElement: any): maybeElement is HTMLElement =>
    maybeElement.attributes != undefined;

export const nodeToPageElement = (
    node: ChildNode | HTMLElement
): PageElement => {
    if (!isElement(node)) return node.nodeValue ?? "";
    const children: PageElement[] = [];

    let attributes: { [key: string]: string } = {};
    for (let attribute, i = 0, n = node.attributes.length; i < n; i++) {
        attribute = node.attributes[i];

        attributes[attribute.nodeName] = attribute.value;
    }
    let numOfNonElements = 0;
    node.childNodes.forEach((child, i) => {
        const childNode =
            child.nodeType == 1 && child.parentElement && numOfNonElements++
                ? child.parentElement.children[i - numOfNonElements]
                : child;
        children.push(nodeToPageElement(childNode));
    });

    return {
        type: node.nodeName.toLowerCase(),
        attributes,
        children,
    };
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

export const elementToHtml = (
    element: PageElement,
    chosenElement?: PageElement
): ChildNode => {
    if (typeof element == "string") return document.createTextNode(element);

    const node = document.createElement(element.type);

    for (const attribute in element.attributes) {
        if (
            Object.prototype.hasOwnProperty.call(element.attributes, attribute)
        ) {
            const value = element.attributes[attribute];

            node.setAttribute(attribute, value ?? "");
        }
    }
    node.setAttribute("wysiwyg", "");

    if (element == chosenElement) node.classList.add("chosen");

    if (element.children) {
        for (const child of element.children) {
            node.appendChild(elementToHtml(child, chosenElement));
        }
    }

    return node;
};
