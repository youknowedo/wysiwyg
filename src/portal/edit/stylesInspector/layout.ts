import { EditMaster, updateEditor } from "../../edit.js";
import type { LayoutStyles } from "./types/layout";

// Update layout settings
export const updateLayoutSettings = (
    styles: LayoutStyles,
    editMaster: EditMaster
) => {
    updateDirectionSettings(styles, editMaster);
    updateAlignJustifySettings(styles, editMaster, "align");
    updateAlignJustifySettings(styles, editMaster, "justify");
};

// Variables used for the direction settings
const directionMaster = {
    inverted: false,
    optionsIndex: 0,
    options: [
        ["column", "row"],
        ["column-reverse", "row-reverse"],
    ] as const,
    // Elements used for the direction settings
    elements: {
        // The highlight element
        highlight: document.querySelector(
            "#direction .horizontalMenu .highlight"
        ) as HTMLElement,
        // The options
        options: document.querySelectorAll(
            "#direction .horizontalMenu button"
        ) as NodeListOf<HTMLButtonElement>,
        // The invert button
        invert: document.getElementById("directionInvert") as HTMLButtonElement,
    },
};

export const hasLayoutStyles = (styles: any): styles is LayoutStyles =>
    styles && styles.layout != undefined;

// Update direction settings
const updateDirectionSettings = (
    styles: LayoutStyles,
    editMaster: EditMaster
) => {
    // Get the index of the current direction
    directionMaster.optionsIndex = directionMaster.options[0].findIndex(
        (o) => o == styles.layout.flexItems.direction
    );
    // If it was found, set inverted to false
    if (directionMaster.optionsIndex != -1) directionMaster.inverted = false;
    else {
        // If it wasn't found, set inverted to true and get the index of the inverted direction
        directionMaster.optionsIndex = directionMaster.options[1].findIndex(
            (o) => o == styles.layout.flexItems.direction
        );
        directionMaster.inverted = true;
    }

    // Set the onclick event for each option
    for (let i = 0; i < directionMaster.elements.options.length; i++) {
        const option = directionMaster.elements.options[i];

        option.onclick = () => {
            if (editMaster.selectedElement == undefined)
                throw new Error("No selected element");

            // Set the direction to the option that was clicked
            styles.layout.flexItems.direction =
                directionMaster.options[+directionMaster.inverted][i];

            editMaster.selectedElement.styles = styles as any;

            updateEditor("full");
        };
    }

    directionMaster.elements.invert.onclick = () => {
        if (editMaster.selectedElement == undefined)
            throw new Error("No selected element");

        // Invert the direction
        directionMaster.inverted = !directionMaster.inverted;

        // Set the direction to the inverted direction
        styles.layout.flexItems.direction =
            directionMaster.options[+directionMaster.inverted][
                directionMaster.optionsIndex
            ];

        // Set the styles
        editMaster.selectedElement.styles = styles as any;

        // Add or remove the inverted class
        if (directionMaster.inverted) {
            directionMaster.elements.invert.classList.add("inverted");
        } else {
            directionMaster.elements.invert.classList.remove("inverted");
        }

        updateEditor("full");
    };

    // Set the highlight position
    directionMaster.elements.highlight.style.top = "0.1rem";
    directionMaster.elements.highlight.style.bottom = "0.1rem";
    directionMaster.elements.highlight.style.left = `${
        directionMaster.elements.options[directionMaster.optionsIndex]
            .offsetLeft
    }px`;
    directionMaster.elements.highlight.style.width = `${
        directionMaster.elements.options[directionMaster.optionsIndex]
            .clientWidth
    }px`;
};

const alignJustifyMaster = {
    align: 0,
    justify: 0,
    options: [
        "flex-start",
        "center",
        "flex-end",
        "stretch",
        "space-between",
    ] as const,
    // Elements used for the align and justify settings
    elements: {
        align: {
            // The highlight element
            highlight: document.querySelector(
                "#align .horizontalMenu .highlight"
            ) as HTMLElement,
            // The options
            options: document.querySelectorAll(
                "#align .horizontalMenu button"
            ) as NodeListOf<HTMLButtonElement>,
        },
        justify: {
            // The highlight element
            highlight: document.querySelector(
                "#justify .horizontalMenu .highlight"
            ) as HTMLElement,
            // The options
            options: document.querySelectorAll(
                "#justify .horizontalMenu button"
            ) as NodeListOf<HTMLButtonElement>,
        },
    },
};

const updateAlignJustifySettings = (
    styles: LayoutStyles,
    editMaster: EditMaster,
    type: "align" | "justify"
) => {
    // Get the index of the current align or justify
    alignJustifyMaster[type] = alignJustifyMaster.options.findIndex(
        (o) => o == styles.layout.flexItems[type]
    );

    // Set the onclick event for each option
    for (let i = 0; i < alignJustifyMaster.elements[type].options.length; i++) {
        const option = alignJustifyMaster.elements[type].options[i];

        option.onclick = () => {
            if (editMaster.selectedElement == undefined)
                throw new Error("No selected element");

            // Set the align or justify to the option that was clicked
            styles.layout.flexItems[type] = alignJustifyMaster.options[i];

            editMaster.selectedElement.styles = styles as any;

            updateEditor("full");
        };
    }

    // Set the highlight position
    alignJustifyMaster.elements[type].highlight.style.top = "0.1rem";
    alignJustifyMaster.elements[type].highlight.style.bottom = "0.1rem";
    alignJustifyMaster.elements[type].highlight.style.left = `${
        alignJustifyMaster.elements[type].options[alignJustifyMaster[type]]
            .offsetLeft
    }px`;
    alignJustifyMaster.elements[type].highlight.style.width = `${
        alignJustifyMaster.elements[type].options[alignJustifyMaster[type]]
            .clientWidth
    }px`;
};
