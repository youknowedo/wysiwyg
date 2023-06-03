export type LayoutStyles = {
    layout: {
        flexItems: {
            direction: FlexDirection;
            align: FlexAlignJustify;
            justify: FlexAlignJustify;
        };
    };
};
export type FlexDirection = "column" | "column-reverse" | "row" | "row-reverse";
export type FlexAlignJustify =
    | "flex-start"
    | "center"
    | "flex-end"
    | "stretch"
    | "space-between";
