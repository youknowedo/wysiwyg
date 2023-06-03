import { updateEditor } from "../../edit.js";
import { BackgroundStyles } from "./types/background";

export const hasBackgroundStyles = (styles: any): styles is BackgroundStyles =>
    styles && styles.backgroundColor !== undefined;

export const updateBackgroundSettings = (styles: BackgroundStyles) => {
    const backgroundColor = document.getElementById(
        "backgroundColor"
    ) as HTMLInputElement;

    backgroundColor.value = styles.backgroundColor;

    backgroundColor.oninput = () => {
        styles.backgroundColor = backgroundColor.value;

        updateEditor("full");
    };
};
