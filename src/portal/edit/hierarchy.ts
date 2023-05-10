import {
    chosenElement,
    hoverElement,
    page,
    render,
    setChosenElement,
    setHoverElement,
    slug,
} from "../edit.js";
import {
    PageElementTypes,
    elementIsContainer,
    elementIsText,
} from "./elements.js";
import { PageElement } from "./page";

const generateHierarchyElement = (element: PageElement, level = 1) => {
    if (!elementIsText(element) && !elementIsContainer(element))
        throw new Error("Element type not recognized");

    const wrapper = document.createElement("div");
    wrapper.setAttribute("wysiwyg", element.type);
    wrapper.classList.add("isElement");

    const text = wrapper.appendChild(document.createElement("span"));
    text.innerText = element.type;
    text.style.paddingLeft = `${level}rem`;
    if (element == chosenElement) text.classList.add("chosen");
    else if (element == hoverElement) text.classList.add("hover");
    text.onclick = (e) => {
        e.preventDefault();

        setChosenElement(element);

        render();
    };
    text.onmouseenter = (e) => {
        e.preventDefault();
        if (e.currentTarget != e.target) return;
        if (hoverElement == element) return;

        setHoverElement(element);

        render();
    };
    text.onmouseleave = (e) => {
        e.preventDefault();
        if (e.currentTarget != e.target) return;
        setHoverElement(undefined);

        render();
    };

    const actions = text.appendChild(document.createElement("div"));
    actions.classList.add("actions");
    const deleteButton = actions.appendChild(document.createElement("button"));
    deleteButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 96 960 960" width="14"><path d="M261 936q-24.75 0-42.375-17.625T201 876V306h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438V306ZM367 790h60V391h-60v399Zm166 0h60V391h-60v399ZM261 306v570-570Z"/></svg>';
    deleteButton.onclick = () => {
        if (element.parent) {
            element.parent.children.splice(
                element.parent.children.findIndex((e) => e == element),
                1
            );
        } else {
            page.body.splice(
                page.body.findIndex((e) => e == element),
                1
            );
        }

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
            wrapper.appendChild(generateHierarchyElement(child, level + 1));
        }
    }

    return wrapper;
};

const hierarchy = document.querySelector<HTMLElement>("#editor>div.left");
if (hierarchy)
    hierarchy.onclick = (e) => {
        e.preventDefault();
        if (e.currentTarget != e.target) return;

        setChosenElement(undefined);

        render();
    };
export const generateHierarchy = () => {
    if (!hierarchy) throw new Error("Hierarchy doesn't exist");

    hierarchy.innerHTML = "";

    const toolbar = hierarchy.appendChild(document.createElement("div"));
    toolbar.classList.add("toolbar");
    toolbar.innerText = slug;
    const newButton = toolbar.appendChild(document.createElement("button"));
    newButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 96 960 960" width="14"><path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z"/></svg><svg xmlns="http://www.w3.org/2000/svg" class="arrow" height="4" viewBox="0 96 960 960" width="4"><path d="m40 917 441-704 439 704H40Z" /></svg>';

    const wrapper = newButton.appendChild(document.createElement("div"));
    const newButtonMenu = wrapper.appendChild(document.createElement("div"));
    newButtonMenu.classList.add("menu");
    const menuItems: (keyof PageElementTypes)[] = ["container", "text"];
    for (const item of menuItems) {
        const newItem = newButtonMenu.appendChild(
            document.createElement("span")
        );
        newItem.innerText = item;
        newItem.onclick = () => {
            let newElement: PageElement<typeof item>;
            if (item == "container")
                newElement = {
                    id: "",
                    type: "container",
                    children: [],
                    hierarchyOpen: true,
                    styles: {
                        layout: {
                            flexItems: {
                                direction: "down",
                                align: "start",
                                justify: "start",
                            },
                        },
                    },
                } as PageElement<"container">;
            else if (item == "text")
                newElement = {
                    id: "",
                    type: "text",
                    tag: "p",
                    value: "Lorem ipsum...",
                } as PageElement<"text">;
            else throw new Error("Element type not recognized: " + item);

            if (chosenElement == undefined) {
                page.body.push(newElement);
            } else if (chosenElement.type == "container") {
                newElement.parent = chosenElement;
                chosenElement.children.push(newElement);
                chosenElement.hierarchyOpen = true;
            } else if (chosenElement.parent) {
                newElement.parent = chosenElement.parent;
                chosenElement.parent.children.push(newElement);
            } else {
                page.body.push(newElement);
            }
            setChosenElement(newElement);

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

    for (const element of page.body) {
        hierarchy.appendChild(generateHierarchyElement(element, 1));
    }
};
