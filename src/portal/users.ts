const userEntries = document.querySelectorAll("#content > #list > div");

// Add event listeners to the delete button of each page
for (const user of userEntries) {
    const deleteButton = user.querySelector(
        "button.delete"
    ) as HTMLButtonElement;

    // Delete page
    deleteButton.onclick = () => {
        const data = new FormData();
        data.append("action", "DELETE");

        data.append("username", user.id);

        fetch("", {
            method: "POST",
            body: data,
        });

        window.location.reload();
    };
}
