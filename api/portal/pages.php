<?php

// Get the MySQL connection
$connection = require __DIR__ . "/../db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // If the action is CREATE, create a new user
    if ($_POST["action"] == "CREATE") {
        // If the username is empty, return 400
        if (empty($_POST["slug"])) {
            http_response_code(400);
            $err = "Slug is required";
        }

        // If the title is empty, return 400
        if (empty($_POST["title"])) {
            http_response_code(400);
            $err = "Title is required";
        }

        // If there is no error, create the user
        if (!isset($err)) {
            // Insert the user into the database
            if (
                $connection->query("INSERT INTO w_pages (slug,title,html)
                                VALUES ('" . $_POST["slug"] . "','" . $_POST["title"] . "','')")
            ) {
                header("Location:/portal/pages/");
                exit;
            } else {
                $err = $connection->error . " [" . $connection->errno . "]";
            }
        }
    } else
        // If the action is DELETE, delete the user
        if ($_POST["action"] == "DELETE") {
            // If the username is empty, return 400
            if (empty($_POST["slug"])) {
                http_response_code(400);
                $err = "Slug is required";
            }

            // If there is no error, delete the user
            if (isset($err)) {
                // Delete the user from the database
                if (
                    $connection->query("DELETE FROM w_pages WHERE slug='" . $_POST["slug"] . "'")
                ) {
                    header("Location:/portal/pages/");
                    exit;
                } else {
                    $err = $connection->error . " " . $connection->errno;
                }
            }
        }
}

?>

<!-- Include the banner component -->
<?php include __DIR__ . "/components/banner.php"; ?>

<div>
    <!-- Include the sidebar component -->
    <?php include __DIR__ . "/components/sidebar.php"; ?>

    <div id="content">
        <div id="list">
            <?php

            $connection = require __DIR__ . "/../db.php";

            $result = $connection->query("SELECT * FROM w_pages");

            while ($page = $result->fetch_assoc()) { ?>
                <div id="<?= $page["slug"] ?>">
                    <div>
                        <h3>
                            <?= $page["slug"] ?>
                        </h3>
                        <span>
                            <?= $page["title"] ?>
                        </span>
                    </div>
                    <div>
                        <a href="/portal/edit/<?= $page["slug"] ?>">Edit</a>
                        <button class="delete">Delete</button>
                    </div>
                </div>
            <?php } ?>
        </div>

        <div>
            <form method="post" id="newListItem">
                <input name="action" value="CREATE" hidden>
                <input name="withHTML" value="true" hidden>
                <div>
                    <label for="slug">Slug</label>
                    <input type="text" id="slug" name="slug">
                </div>

                <div>
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title">
                </div>

                <button type="submit">Create Page</button>
            </form>

            <!-- If there is an error, display it -->
            <?php if (isset($err)) { ?>
                <div id="error">
                    <?= $err ?>
                </div>
            <?php } ?>
        </div>

    </div>
</div>

<script src="/src/portal/pages.js" type="module"></script>