<style>
    :root {
        --dark: #101020;
        --grey: #212133;
        --light-grey: #2d2d42;
        --purple: #8438fa;
    }

    body {
        margin: 0;
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

    #inspector {
        height: calc(100vh - 50px);
        width: 200px;

        background-color: var(--dark);
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