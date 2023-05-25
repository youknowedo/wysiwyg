import { generateId } from "../../utils/id.js";
import { EditMaster, render, slug } from "../edit.js";
import {
    PageElementTypes,
    elementIsContainer,
    elementIsText,
} from "./elements.js";
import { PageElement } from "./page.js";

const generateHierarchyElement = (
    element: PageElement,
    editMaster: EditMaster,
    level = 1
) => {
    if (!elementIsText(element) && !elementIsContainer(element))
        throw new Error("Element type not recognized");

    const wrapper = document.createElement("div");
    wrapper.setAttribute("wysiwyg", element.type);
    wrapper.classList.add("isElement");

    const text = wrapper.appendChild(document.createElement("span"));
    text.innerText = element.type;
    text.style.paddingLeft = `${level}rem`;
    if (element == editMaster.chosenElement) text.classList.add("chosen");
    else if (element == editMaster.hoverElement) text.classList.add("hover");
    text.onclick = (e) => {
        e.preventDefault();

        editMaster.hoverElement = undefined;
        editMaster.chosenElement = element;

        render();
    };
    text.onmouseenter = (e) => {
        e.preventDefault();
        if (e.currentTarget != e.target) return;
        if (editMaster.hoverElement == element) return;

        editMaster.hoverElement = element;

        render();
    };
    text.onmouseleave = (e) => {
        e.preventDefault();
        if (e.currentTarget != e.target) return;
        editMaster.hoverElement = undefined;

        render();
    };

    const actions = text.appendChild(document.createElement("div"));
    actions.classList.add("actions");
    const deleteButton = actions.appendChild(document.createElement("button"));
    deleteButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 96 960 960" width="14"><path d="M261 936q-24.75 0-42.375-17.625T201 876V306h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438V306ZM367 790h60V391h-60v399Zm166 0h60V391h-60v399ZM261 306v570-570Z"/></svg>';
    deleteButton.onclick = (e) => {
        e.preventDefault();
        editMaster.chosenElement = undefined;

        if (element.parent) {
            element.parent.children.splice(
                element.parent.children.findIndex((e) => e == element),
                1
            );
        } else {
            editMaster.page.body.splice(
                editMaster.page.body.findIndex((e) => e == element),
                1
            );
        }

        console.log(editMaster);
        render();
    };

    if (elementIsContainer(element)) {
        const arrow = document.createElement("div");
        arrow.classList.add("arrow");
        arrow.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" height="6" viewBox="0 96 960 960" width="6"><path d="m40 917 441-704 439 704H40Z" /></svg>';
        (arrow.firstElementChild as HTMLElement).onclick = () => {
            element.hierarchyOpen = !element.hierarchyOpen;

            render();
        };
        text.prepend(arrow);

        if (!element.hierarchyOpen) wrapper.classList.add("close");
        if (!element.children) element.children = [];

        for (const child of element.children) {
            wrapper.appendChild(
                generateHierarchyElement(child, editMaster, level + 1)
            );
        }
    }

    return wrapper;
};

const hierarchy = document.querySelector<HTMLElement>("#editor>div.left");
export const generateHierarchy = (editMaster: EditMaster) => {
    if (!hierarchy) throw new Error("Hierarchy doesn't exist");
    else {
        hierarchy.onclick = (e) => {
            e.preventDefault();
            if (e.currentTarget != e.target) return;

            editMaster.chosenElement = undefined;

            render();
        };
    }

    const elements = hierarchy.querySelector("#elements") as HTMLElement;
    elements.innerHTML = "";
    const newButton = hierarchy.querySelector(
        "#newButton"
    ) as HTMLButtonElement;
    const buttonMenu = newButton?.querySelector(".hoverMenu") as HTMLElement;

    for (const item of buttonMenu.children) {
        (item as HTMLElement).onclick = () => {
            let newElement: PageElement;
            if (item.id == "container") {
                newElement = {
                    id: generateId(5),
                    type: "container",
                    children: [],
                    hierarchyOpen: true,
                    styles: {
                        layout: {
                            flexItems: {
                                direction: "column",
                                align: "flex-start",
                                justify: "flex-start",
                            },
                        },
                    },
                } as PageElement<"container">;
            } else if (item.id == "text")
                newElement = {
                    id: generateId(5),
                    type: "text",
                    tag: "p",
                    value: "Lorem ipsum...",
                } as PageElement<"text">;

            if (editMaster.chosenElement == undefined) {
                editMaster.page.body.push(newElement);
            } else if (editMaster.chosenElement.type == "container") {
                newElement.parent = editMaster.chosenElement;
                editMaster.chosenElement.children.push(newElement);
                editMaster.chosenElement.hierarchyOpen = true;
            } else if (editMaster.chosenElement.parent) {
                newElement.parent = editMaster.chosenElement.parent;
                editMaster.chosenElement.parent.children.push(newElement);
            } else {
                editMaster.page.body.push(newElement);
            }
            editMaster.chosenElement = newElement;

            render();
        };
    }

    newButton.onclick = () => {
        newButton.classList.add("open");
        newButton.onmouseleave = () => {
            newButton.onmouseleave = null;
            newButton.classList.remove("open");
        };
    };

    for (const element of editMaster.page.body) {
        elements.appendChild(generateHierarchyElement(element, editMaster, 1));
    }
};
