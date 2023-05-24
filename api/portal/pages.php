<?php

$connection = require __DIR__ . "/../db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_POST["action"] == "CREATE") {
        if (empty($_POST["slug"])) {
            http_response_code(400);
            die("Slug is required");
        }
        if (empty($_POST["title"])) {
            http_response_code(400);
            die("Title is required");
        }


        if (
            $connection->query("INSERT INTO w_pages (slug,title,html)
                                VALUES ('" . $_POST["slug"] . "','" . $_POST["title"] . "','')")
        )
            echo "Page created";
        else {
            die($connection->error . " " . $connection->errno);
        }

        header("Location:/portal/pages");
        exit;
    } else if ($_POST["action"] == "DELETE") {
        if (empty($_POST["slug"])) {
            http_response_code(400);
            die("Slug is required");
        }

        if (
            $connection->query("DELETE FROM w_pages WHERE slug='" . $_POST["slug"] . "'")
        )
            echo "Slug deleted";
        else {
            die($connection->error . " " . $connection->errno);
        }
    }
}

?>

<?php include __DIR__ . "/components/banner.php"; ?>

<div>
    <?php include __DIR__ . "/components/sidebar.php"; ?>
    <div id="content">
        <div id="list">
            <?php

            $connection = require __DIR__ . "/../db.php";

            $result = $connection->query("SELECT * FROM w_pages");

            while ($page = $result->fetch_assoc()) {
                ?>

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
                        <a href="/edit/<?= $slug ?>">Edit</a>
                        <button class="delete">Delete</button>
                    </div>
                </div>

                <?php
            }

            ?>
        </div>

        <form method="post" id="newListItem">
            <input name="action" value="CREATE" hidden>
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

    </div>
</div>

<script src="/src/portal/pages.js" type="module"></script>