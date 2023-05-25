import { EditMaster, updateEditor } from "../edit.js";
import {
    hasLayoutStyles,
    updateLayoutSettings,
} from "./stylesInspector/layout.js";

const layoutSettings = document.getElementById("layout") as HTMLElement;

export const updateStylesInspector = (editMaster: EditMaster) => {
    let styles = editMaster.selectedElement?.styles;

    // Update the layout settings if the selected element has layout styles
    if (hasLayoutStyles(styles)) {
        layoutSettings.style.display = "block";
        updateLayoutSettings(styles, editMaster);
    } else layoutSettings.style.display = "none";
};
