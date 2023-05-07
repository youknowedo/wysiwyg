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
): element is PageElement<"container"> => element.type == "container";
export interface PageElementContainer extends PageElementType {
    hierarchyOpen: boolean;
    children: PageElement<keyof PageElementTypes>[];
}

export const elementIsText = (
    element: PageElement
): element is PageElement<"text"> => element.type == "text";
export type PageElementTextTag = "p" | "h1" | "h2" | "h3" | "h4";
export interface PageElementText extends PageElementType {
    tag: PageElementTextTag;
    value: string;
}
