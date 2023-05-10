import { chosenElement } from "../edit.js";

export const hasLayoutStyles = (styles: any): styles is LayoutStyles =>
    styles.layout != undefined;
export type LayoutStyles = {
    layout: {
        flexItems: {
            direction: "up" | "down" | "left" | "right";
            align: "start" | "center" | "end" | "stretch";
            justify: "start" | "center" | "end" | "stretch";
        };
    };
};

document.getElementById("stylesInspector");
export const generateStylesInspector = () => {
    const styles = chosenElement.styles;

    if (hasLayoutStyles(styles)) {
        const directionItem = document.getElementById("direction");
        const menu = directionItem?.querySelector(".horizontalMenu");
        const highlight = menu?.querySelector(".highlight") as HTMLElement;
        const options = menu?.querySelectorAll("button");
        switch (styles.layout.flexItems.direction) {
            case "down":
                highlight.style.left = options?.[0].offsetLeft.toString;
                break;

            default:
                break;
        }
    }
};
