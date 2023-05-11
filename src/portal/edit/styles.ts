import { EditMaster, render } from "../edit.js";
import { PageElement } from "./page.js";
import { generateLayoutSettings, hasLayoutStyles } from "./styles/layout.js";

const layoutSettings = document.getElementById("layout") as HTMLElement;
export const generateStylesInspector = (editMaster: EditMaster) => {
    let styles = editMaster.chosenElement?.styles;

    if (hasLayoutStyles(styles)) {
        layoutSettings.style.display = "block";
        generateLayoutSettings(styles, editMaster);
    } else layoutSettings.style.display = "none";
};
