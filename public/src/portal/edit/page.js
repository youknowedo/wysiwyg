export const htmlToPage = (html) => {
    const body = [];
    const HtmlBody = document.createElement("body");
    HtmlBody.innerHTML = html;
    HtmlBody.childNodes.forEach((node, i) => {
        body.push(nodeToPageElement(node.nodeType == 1 && node.parentElement
            ? node.parentElement.children[i]
            : node));
    });
    return {
        body,
    };
};
export const isElement = (maybeElement) => maybeElement.attributes != undefined;
export const nodeToPageElement = (node) => {
    if (!isElement(node))
        return node.nodeValue ?? "";
    const children = [];
    let attributes = {};
    for (let attribute, i = 0, n = node.attributes.length; i < n; i++) {
        attribute = node.attributes[i];
        attributes[attribute.nodeName] = attribute.value;
    }
    let numOfNonElements = 0;
    node.childNodes.forEach((child, i) => {
        const childNode = child.nodeType == 1 && child.parentElement && numOfNonElements++
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
export const pageToHtml = (page) => {
    let html = "";
    for (const element of page.body) {
        html += elementToHtml(element);
    }
    return html;
};
export const elementToHtml = (element) => {
    if (typeof element == "string")
        return element;
    let attributes = "";
    for (const attribute in element.attributes) {
        if (Object.prototype.hasOwnProperty.call(element.attributes, attribute)) {
            const value = element.attributes[attribute];
            attributes += `${attribute}="${value}" `;
        }
    }
    let children = "";
    for (const child of element.children) {
        children += elementToHtml(child);
    }
    const wysiwygMenu = '<span class="menu"></span>';
    return `<${element.type} ${attributes} wysiwyg>${wysiwygMenu}${children}</${element.type}>`;
};
