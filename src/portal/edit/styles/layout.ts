import { EditMaster, render } from "../../edit.js";

const directionElements = {
    highlight: document.querySelector(
        "#direction .horizontalMenu .highlight"
    ) as HTMLElement,
    options: document.querySelectorAll(
        "#direction .horizontalMenu button"
    ) as NodeListOf<HTMLButtonElement>,
    invert: document.getElementById("directionInvert") as HTMLButtonElement,
};

export const hasLayoutStyles = (styles: any): styles is LayoutStyles =>
    styles?.layout != undefined;
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

const directionOptions = [
    ["column", "row"],
    ["column-reverse", "row-reverse"],
] as const;
const directionMaster = { inverted: false, optionsIndex: 0 };
const DirectionSettings = (styles: LayoutStyles, editMaster: EditMaster) => {
    directionMaster.optionsIndex = directionOptions[0].findIndex(
        (o) => o == styles.layout.flexItems.direction
    );
    if (directionMaster.optionsIndex == -1) {
        directionMaster.optionsIndex = directionOptions[1].findIndex(
            (o) => o == styles.layout.flexItems.direction
        );
        directionMaster.inverted = true;
    } else directionMaster.inverted = false;

    for (let i = 0; i < directionElements.options.length; i++) {
        const option = directionElements.options[i];

        option.onclick = () => {
            if (hasLayoutStyles(styles)) {
                styles.layout.flexItems.direction =
                    directionOptions[+directionMaster.inverted][i];

                editMaster.chosenElement.styles = styles;

                render();
            }
        };
    }

    directionElements.invert.onclick = () => {
        if (hasLayoutStyles(styles)) {
            directionMaster.inverted = !directionMaster.inverted;

            styles.layout.flexItems.direction =
                directionOptions[+directionMaster.inverted][
                    directionMaster.optionsIndex
                ];

            editMaster.chosenElement.styles = styles;

            if (directionMaster.inverted) {
                directionElements.invert.classList.add("inverted");
            } else {
                directionElements.invert.classList.remove("inverted");
            }

            render();
        }
    };

    directionElements.highlight.style.top = "0.1rem";
    directionElements.highlight.style.bottom = "0.1rem";
    directionElements.highlight.style.left = `${
        directionElements.options[directionMaster.optionsIndex].offsetLeft
    }px`;
    directionElements.highlight.style.width = `${
        directionElements.options[directionMaster.optionsIndex].clientWidth
    }px`;
};

const alignJustifyElements = {
    align: {
        highlight: document.querySelector(
            "#align .horizontalMenu .highlight"
        ) as HTMLElement,
        options: document.querySelectorAll(
            "#align .horizontalMenu button"
        ) as NodeListOf<HTMLButtonElement>,
    },
    justify: {
        highlight: document.querySelector(
            "#justify .horizontalMenu .highlight"
        ) as HTMLElement,
        options: document.querySelectorAll(
            "#justify .horizontalMenu button"
        ) as NodeListOf<HTMLButtonElement>,
    },
};
const alignJustifyOptions = [
    "flex-start",
    "center",
    "flex-end",
    "stretch",
    "space-between",
] as const;
let alignJustifyIndexes = { align: 0, justify: 0 };
const AlignJustifySettings = (
    styles: LayoutStyles,
    editMaster: EditMaster,
    type: "align" | "justify"
) => {
    alignJustifyIndexes[type] = alignJustifyOptions.findIndex(
        (o) => o == styles.layout.flexItems[type]
    );

    for (let i = 0; i < alignJustifyElements[type].options.length; i++) {
        const option = alignJustifyElements[type].options[i];

        option.onclick = () => {
            if (hasLayoutStyles(styles)) {
                styles.layout.flexItems[type] = alignJustifyOptions[i];

                editMaster.chosenElement.styles = styles;

                render();
            }
        };
    }

    alignJustifyElements[type].highlight.style.top = "0.1rem";
    alignJustifyElements[type].highlight.style.bottom = "0.1rem";
    alignJustifyElements[type].highlight.style.left = `${
        alignJustifyElements[type].options[alignJustifyIndexes[type]].offsetLeft
    }px`;
    alignJustifyElements[type].highlight.style.width = `${
        alignJustifyElements[type].options[alignJustifyIndexes[type]]
            .clientWidth
    }px`;
};

export const generateLayoutSettings = (
    styles: LayoutStyles,
    editMaster: EditMaster
) => {
    DirectionSettings(styles, editMaster);
    AlignJustifySettings(styles, editMaster, "align");
    AlignJustifySettings(styles, editMaster, "justify");
};
