<?php

$connection = require __DIR__ . "/../db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_POST["action"] == "CREATE") {
        if (empty($_POST["username"])) {
            http_response_code(400);
            exit("Username is required");
        }

        if (strlen($_POST["password"]) < 8) {
            http_response_code(400);
            exit("Password must be more than 8 characters");
        }
        if (!preg_match("/[a-z]/i", $_POST["password"])) {
            http_response_code(400);
            exit("Password must contain one letter");
        }
        if (!preg_match("/[0-9]/i", $_POST["password"])) {
            http_response_code(400);
            exit("Password must contain one number");
        }
        if ($_POST["password"] !== $_POST["repeat"]) {
            http_response_code(400);
            exit("Passwords must match");
        }

        $password_hash = password_hash($_POST["password"], PASSWORD_DEFAULT);

        if (
            $connection->query("INSERT INTO w_users (username,password_hash)
                                VALUES ('" . $_POST["username"] . "','" . $password_hash . "')")
        )
            echo "User created";
        else {
            if ($connection->errno === 1062)
                exit("Username already taken");
            else
                exit($connection->error . " " . $connection->errno);
        }

        header("Location:/portal/users");
        exit;
    } else if ($_POST["action"] == "DELETE") {
        if (empty($_POST["username"])) {
            http_response_code(400);
            exit("Username is required");
        }

        if (
            $connection->query("DELETE FROM w_users WHERE username='" . $_POST["username"] . "'")
        )
            echo "User deleted";
        else {
            exit($connection->error . " " . $connection->errno);
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

            $result = $connection->query("SELECT * FROM w_users");

            while ($user = $result->fetch_assoc()) {
                ?>

                <div id="<?= $user["username"] ?>">
                    <div>
                        <h3>
                            <?= $user["username"] ?>
                        </h3>
                    </div>
                    <?php
                    if ($session["username"] != $user["username"]) {
                        ?>
                        <button class="delete">Delete</button>
                        <?php
                    } ?>
                </div>

                <?php
            }

            ?>
        </div>

        <form method="post" id="newListItem">
            <input name="action" value="CREATE" hidden>
            <div>
                <label for="username">Username</label>
                <input type="text" id="username" name="username">
            </div>

            <div>
                <label for="password">Password</label>
                <input type="password" id="password" name="password">
            </div>
            <div>
                <label for="repeat">Repeat Password</label>
                <input type="password" id="repeat" name="repeat">
            </div>

            <button type="submit">Create User</button>
        </form>

    </div>
</div>

<script src="/src/portal/users.js" type="module"></script>