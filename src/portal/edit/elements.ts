import { BackgroundStyles } from "./stylesInspector/types/background";
import { LayoutStyles } from "./stylesInspector/types/layout";
import { PositionStyles } from "./stylesInspector/types/position";

export type Page = {
    body: AnyPageElement[];
};

export type PageElement<K extends keyof PageElementTypes> = {
    type: K;
    parent?: PageElement<"container">;
} & PageElementTypes[K];

export type AnyPageElement = PageElement<"container"> | PageElement<"text">;

export interface PageElementTypes {
    container: PageElementContainer;
    text: PageElementText;
}

export interface PageElementType<S = {}> {
    id: string;
    styles: S;
}

export const elementIsContainer = (
    element: any
): element is PageElement<"container"> => element.type == "container";
export interface PageElementContainer
    extends PageElementType<LayoutStyles & BackgroundStyles & PositionStyles> {
    hierarchyOpen: boolean;
    children: AnyPageElement[];
}

export const elementIsText = (element: any): element is PageElement<"text"> =>
    element.type == "text";
export type PageElementTextTag = "p" | "h1" | "h2" | "h3" | "h4";
export interface PageElementText extends PageElementType<PositionStyles> {
    tag: PageElementTextTag;
    value: string;
}
