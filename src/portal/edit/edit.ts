import { htmlToPage, pageToHtml, type Page } from "./page.js";

const db = await fetch("/temp_database.json").then((res) => res.json());

const iframe = document.getElementById("page") as HTMLIFrameElement;
const page = htmlToPage(db.home);

const editIFrame = (page: Page) => {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("iframe missing doc");

    doc.body.innerHTML = pageToHtml(page);

    const css = doc.createElement("link");
    css.href = "/styles/portal/edit/page.css";
    css.rel = "stylesheet";
    css.type = "text/css";
    doc.head.appendChild(css);
};
editIFrame(page);
