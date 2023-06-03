const pageEntries = document.querySelectorAll("#content > #list > div");

// Add event listeners to edit and delete buttons of each page
for (const page of pageEntries) {
    const editButton = page.querySelector("button.edit") as HTMLButtonElement;

    // Redirect to edit page
    editButton.onclick = () => {
        window.location.replace("/portal/edit/" + page.id);
    };

    const deleteButton = page.querySelector(
        "button.delete"
    ) as HTMLButtonElement;

    // Delete page
    deleteButton.onclick = () => {
        const data = new FormData();
        data.append("action", "DELETE");

        data.append("slug", page.id);

        fetch("", {
            method: "POST",
            body: data,
        });

        window.location.reload();
    };
}
