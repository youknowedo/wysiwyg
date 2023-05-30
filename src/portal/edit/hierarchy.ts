import { generateId } from "../../utils/id.js";
import { EditMaster, updateEditor } from "../edit.js";
import {
    AnyPageElement,
    PageElement,
    elementIsContainer,
    elementIsText,
} from "./elements.js";

const hierarchy = document.querySelector("#editor>div.left") as HTMLElement;
const elements = hierarchy.querySelector("#elements") as HTMLElement;
const newElementButton = hierarchy.querySelector(
    "#newButton"
) as HTMLButtonElement;
const buttonMenu = newElementButton?.querySelector(".hoverMenu") as HTMLElement;

export const hierarchyOnLoad = (editMaster: EditMaster) => {
    // Reset the selected element when clicking on the hierarchy
    hierarchy.onclick = (e) => {
        // Check if the click was on the hierarchy
        if (e.currentTarget != e.target) return;

        // Reset the selected and hovered element
        editMaster.hoverElement = undefined;
        editMaster.selectedElement = undefined;

        updateEditor("full");
    };

    // Add event listeners to the buttons in the new element menu
    for (const item of buttonMenu.children) {
        // Add on click event listener
        (item as HTMLElement).onclick = () => {
            let newElement: AnyPageElement;

            // Create the new element depending on the type
            switch (item.id) {
                case "container":
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
                            backgroundColor: "#ffffff",
                        },
                    } as PageElement<"container">;
                    break;

                case "text":
                    newElement = {
                        id: generateId(5),
                        type: "text",
                        tag: "p",
                        value: "Lorem ipsum...",
                    } as PageElement<"text">;
                    break;

                default:
                    throw new Error("Element type not recognized " + item.id);
            }

            if (editMaster.selectedElement == undefined) {
                // If there is no selected element, add the new element to the top level
                editMaster.page.body.push(newElement);
            } else if (editMaster.selectedElement.type == "container") {
                // Else if the selected element is a container, add the new element to the container
                newElement.parent = editMaster.selectedElement;
                editMaster.selectedElement.children.push(newElement);
                editMaster.selectedElement.hierarchyOpen = true;
            } else if (editMaster.selectedElement.parent) {
                // Else if the selected element has a parent, add the new element to the parent
                newElement.parent = editMaster.selectedElement.parent;
                editMaster.selectedElement.parent.children.push(newElement);
            } else {
                // Else add the new element to the top level
                editMaster.page.body.push(newElement);
            }

            // Select the new element
            editMaster.selectedElement = newElement;

            updateEditor("full");
        };
    }

    // Opens the menu when the button is new element button is clicked
    newElementButton.onclick = () => {
        newElementButton.classList.add("open");
        newElementButton.onmouseleave = () => {
            newElementButton.onmouseleave = null;
            newElementButton.classList.remove("open");
        };
    };
};

export const updateHierarchy = (editMaster: EditMaster) => {
    // Removes all of the elements from the hierarchy
    elements.innerHTML = "";

    // Adds all of the elements to the hierarchy
    for (const element of editMaster.page.body) {
        elements.appendChild(createHierarchyElement(element, editMaster, 1));
    }
};

// Creates an element for the hierarchy
const createHierarchyElement = (
    element: AnyPageElement,
    editMaster: EditMaster,
    level = 1
) => {
    // Check if the element is of a valid type
    if (!elementIsText(element) && !elementIsContainer(element))
        throw new Error("Element type not recognized " + element);

    // Create the element
    const wrapper = document.createElement("div");
    wrapper.setAttribute("wysiwyg", element.type);
    wrapper.classList.add("isElement");

    const text = wrapper.appendChild(document.createElement("span"));
    text.innerText = element.type;
    text.style.paddingLeft = `${level}rem`;

    // Add styles if the element is selected or hovered
    if (element == editMaster.selectedElement) text.classList.add("selected");
    else if (element == editMaster.hoverElement) text.classList.add("hover");

    // If the element is clicked, select it
    text.onclick = (e) => {
        e.preventDefault();

        editMaster.hoverElement = undefined;
        editMaster.selectedElement = element;

        updateEditor("full");
    };

    // If the element is hovered, make it the hovered element
    text.onmouseenter = (e) => {
        if (e.currentTarget != e.target) return;

        // Don't change the hovered element if the element is selected.
        // This is because the selected element is already highlighted
        if (editMaster.hoverElement == element) return;

        // Set the element as the hovered element
        editMaster.hoverElement = element;

        updateEditor("elementsOnly");
    };

    // If the element is unhovered, remove it as the hovered element
    text.onmouseleave = (e) => {
        if (e.currentTarget != e.target) return;

        // Don't change the hovered element if the element is selected.
        // This is because the selected element is already highlighted
        if (editMaster.selectedElement == element) return;

        // Remove the element as the hovered element
        editMaster.hoverElement = undefined;

        updateEditor("elementsOnly");
    };

    // Create the actions menu
    const actions = text.appendChild(document.createElement("div"));
    actions.classList.add("actions");
    const deleteButton = actions.appendChild(document.createElement("button"));
    deleteButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 96 960 960" width="14"><path d="M261 936q-24.75 0-42.375-17.625T201 876V306h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438V306ZM367 790h60V391h-60v399Zm166 0h60V391h-60v399ZM261 306v570-570Z"/></svg>';

    // If the delete button is clicked, delete the element
    deleteButton.onclick = (e) => {
        e.preventDefault();

        // Reset the selected element
        editMaster.selectedElement = undefined;

        if (element.parent) {
            // If the element has a parent, remove it from the parents children
            element.parent.children.splice(
                element.parent.children.findIndex((e) => e == element),
                1
            );
        } else {
            // Else remove it from the top level
            editMaster.page.body.splice(
                editMaster.page.body.findIndex((e) => e == element),
                1
            );
        }

        updateEditor("full");
    };

    // If the element is a container, add the arrow and add the children
    if (elementIsContainer(element)) {
        // Create the arrow
        const arrow = document.createElement("div");
        arrow.classList.add("arrow");
        arrow.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" height="6" viewBox="0 96 960 960" width="6"><path d="m40 917 441-704 439 704H40Z" /></svg>';
        (arrow.firstElementChild as HTMLElement).onclick = () => {
            element.hierarchyOpen = !element.hierarchyOpen;

            updateEditor("elementsOnly");
        };
        text.prepend(arrow);

        if (!element.hierarchyOpen) wrapper.classList.add("close");
        if (!element.children) element.children = [];

        // Add the children
        for (const child of element.children) {
            wrapper.appendChild(
                createHierarchyElement(child, editMaster, level + 1)
            );
        }
    }

    return wrapper;
};
