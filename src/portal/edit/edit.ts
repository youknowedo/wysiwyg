import { htmlToPage, pageToHtml, type Page } from "./page.js";

const iframe = document.getElementById("page") as HTMLIFrameElement;
const page = htmlToPage('<head></head><div id="thing"><p>Hejhå</p></div>');

const editIFrame = (page: Page) => {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("iframe missing doc");

    doc.body.innerHTML = pageToHtml(page);
    console.log(pageToHtml(page));

    const css = doc.createElement("link");
    css.href = "/styles/portal/edit/page.css";
    css.rel = "stylesheet";
    css.type = "text/css";
    doc.head.appendChild(css);
    console.log(doc.head.children.length);
};
editIFrame(page);
