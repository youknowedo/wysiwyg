import { EditMaster } from "../edit.js";
import {
    hasBackgroundStyles,
    updateBackgroundSettings,
} from "./stylesInspector/background.js";
import {
    hasLayoutStyles,
    updateLayoutSettings,
} from "./stylesInspector/layout.js";
import {
    hasPositionStyles,
    updatePositionSettings,
} from "./stylesInspector/position.js";

const layoutSettings = document.getElementById("layout") as HTMLElement;
const backgroundSettings = document.getElementById("background") as HTMLElement;
const positionSettings = document.getElementById("position") as HTMLElement;

export const updateStylesInspector = (editMaster: EditMaster) => {
    let styles = editMaster.selectedElement?.styles;

    // Update the layout settings if the selected element has layout styles
    if (hasLayoutStyles(styles)) {
        layoutSettings.style.display = "block";
        updateLayoutSettings(styles, editMaster);
    } else layoutSettings.style.display = "none";

    // Update the background settings if the selected element has background styles
    if (hasBackgroundStyles(styles)) {
        backgroundSettings.style.display = "block";
        updateBackgroundSettings(styles);
    } else backgroundSettings.style.display = "none";

    // Update the position settings if the selected element has position styles
    if (hasPositionStyles(styles)) {
        positionSettings.style.display = "block";
        updatePositionSettings(styles, editMaster);
    } else positionSettings.style.display = "none";
};
