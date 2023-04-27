<style>
    :root {
        --dark: #101020;
        --grey: #212133;
        --light-grey: #2d2d42;
        --purple: #8438fa;
    }

    body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
    }

    #banner {
        display: flex;
        align-items: center;

        height: 48px;
        width: 100%;
        background-color: var(--dark);
        border-bottom: 1px solid var(--light-grey);
    }

    #banner>#tools {
        flex: 1;
    }

    #banner>#modeSelector {
        width: 200px;
    }

    #banner>#modeSelector::before {
        content: "";
        display: block;
        height: 25px;
        width: 1px;
        background-color: var(--light-grey);
    }

    #editor {
        display: flex;
    }

    .menu {
        height: calc(100vh - 50px);
        width: 200px;

        background-color: var(--dark);
    }

    #left {
        color: white;
    }

    #left div {
        padding: 0 0.5rem;
        margin-top: 0.25rem;
        margin-left: 0.5rem;
        display: inline-block;
    }

    #left div.isElement {
        position: relative;
        padding-bottom: 1rem;
        margin-bottom: 0.5rem;
    }


    #left div.isElement::after {
        content: "";
        position: absolute;
        top: 2.5rem;
        bottom: 0;
        left: 1rem;
        width: 0.25rem;

        border-left: 1px solid rgba(255, 255, 255, 0.25);
        border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    }

    #left div.isElement .newButton {
        position: absolute;
        bottom: 0;
        left: 1.5rem;
        background-color: var(--light-grey);
        height: 1rem;
        width: 1rem;
        translate: 0 50%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        color: rgba(255, 255, 255, 0.5);
        border: 0;
    }

    #left div.isElement .newButton:hover {
        color: white;
        cursor: pointer;
    }

    #left span {
        display: block;
        width: 3rem;
        background-color: var(--light-grey);
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
    }

    div:has(>#page) {
        padding: 1rem;
        display: flex;
        flex: 1;
        background-color: var(--grey);
    }

    #page {
        flex: 1;
        border: 1 solid var(--sb-blue);
        border-radius: 1rem;
        background-color: white;
    }
</style>