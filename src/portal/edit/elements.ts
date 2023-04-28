import { PageElement } from "./page";

export interface PageElementTypes {
    container: PageElementContainer;
    text: PageElementText;
}

export interface PageElementType {
    id: string;
}

export const elementIsContainer = (
    element: PageElement
): element is PageElement<"container"> => element.children != undefined;
export interface PageElementContainer extends PageElementType {
    children: PageElement<keyof PageElementTypes>[];
}

export const elementIsText = (
    element: PageElement
): element is PageElement<"text"> =>
    element.tag != undefined && element.value != undefined;
export type PageElementTextTag = "p" | "h1" | "h2" | "h3" | "h4";
export interface PageElementText extends PageElementType {
    tag: PageElementTextTag;
    value: string;
}
