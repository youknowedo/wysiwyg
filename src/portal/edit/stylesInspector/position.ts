import { EditMaster, updateEditor } from "../../edit.js";
import { PositionStyles } from "./types/position";

export const updatePositionSettings = (
    styles: PositionStyles,
    editMaster: EditMaster
) => {
    updatePositionTypeSetting(styles, editMaster);
};

export const hasPositionStyles = (styles: any): styles is PositionStyles =>
    styles && styles.position !== undefined;

const positionTypeMaster = {
    optionsIndex: 0,
    options: ["relative", "absolute"] as const,
    // Elements used for the position type setting
    elements: {
        // The highlight element
        highlight: document.querySelector(
            "#positionType .horizontalMenu .highlight"
        ) as HTMLElement,
        // The options
        options: document.querySelectorAll(
            "#positionType .horizontalMenu button"
        ) as NodeListOf<HTMLButtonElement>,
    },
};

const updatePositionTypeSetting = (
    styles: PositionStyles,
    editMaster: EditMaster
) => {
    // Get the index of the current position type
    positionTypeMaster.optionsIndex = positionTypeMaster.options.indexOf(
        styles.position.type
    );

    // Set the onclick event for each option
    for (let i = 0; i < positionTypeMaster.elements.options.length; i++) {
        positionTypeMaster.elements.options[i].onclick = () => {
            if (editMaster.selectedElement == undefined)
                throw new Error("No selected element");

            // Set the position type to the option that was clicked
            styles.position.type = positionTypeMaster.options[i];

            editMaster.selectedElement.styles = styles;

            updateEditor("full");
        };
    }

    // Set the highlight position
    positionTypeMaster.elements.highlight.style.top = "0.1rem";
    positionTypeMaster.elements.highlight.style.bottom = "0.1rem";
    positionTypeMaster.elements.highlight.style.left = `${
        positionTypeMaster.elements.options[positionTypeMaster.optionsIndex]
            .offsetLeft
    }px`;
    positionTypeMaster.elements.highlight.style.width = `${
        positionTypeMaster.elements.options[positionTypeMaster.optionsIndex]
            .clientWidth
    }px`;
};
