<?php

// Get the MySQL connection
$connection = require __DIR__ . "/../db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // If the action is CREATE, create a new user
    if ($_POST["action"] == "CREATE") {
        // If the username is empty, return 400
        if (empty($_POST["username"])) {
            http_response_code(400);
            $err = "Username is required";
        }

        // If the password is empty, return 400
        if (strlen($_POST["password"]) < 8) {
            http_response_code(400);
            $err = "Password must be more than 8 characters";
        }
        // If the password does not contain a letter, return 400
        if (!preg_match("/[a-z]/i", $_POST["password"])) {
            http_response_code(400);
            $err = "Password must contain one letter";
        }
        // If the password does not contain a number, return 400
        if (!preg_match("/[0-9]/i", $_POST["password"])) {
            http_response_code(400);
            $err = "Password must contain one number";
        }
        // If the password does not contain a symbol, return 400
        if ($_POST["password"] !== $_POST["repeat"]) {
            http_response_code(400);
            $err = "Passwords must match";
        }

        // Hash the password
        $password_hash = password_hash($_POST["password"], PASSWORD_DEFAULT);

        // If there is no error, create the user
        if (!isset($err)) {
            // Insert the user into the database
            if (
                $connection->query("INSERT INTO w_users (username,password_hash)
                                VALUES ('" . $_POST["username"] . "','" . $password_hash . "')")
            )
                echo "User created";
            else {
                // If there is an error, return 500
                http_response_code(500);
                // If the error is a duplicate entry, specify that the username is already taken
                if ($connection->errno === 1062)
                    $err = "Username already taken";
                else
                    $err = $connection->error . " [" . $connection->errno . "]";
            }
        }
    } else if ($_POST["action"] == "DELETE") { // If the action is DELETE, delete the user
        // If the username is empty, return 400
        if (empty($_POST["username"])) {
            http_response_code(400);
            $err = "Username is required";
        }

        // If there is no error, delete the user
        if (!isset($err)) {
            // Delete the user from the database
            if (
                $connection->query("DELETE FROM w_users WHERE username='" . $_POST["username"] . "'")
            )
                echo "User deleted";
            else {
                $err = $connection->error . " [" . $connection->errno . "]";
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

            // Get the MySQL connection
            $connection = require __DIR__ . "/../db.php";

            // Get all the users
            $result = $connection->query("SELECT * FROM w_users");

            // For each user, create a div with the username and a delete button
            while ($user = $result->fetch_assoc()) { ?>
                <div id="<?= $user["username"] ?>">
                    <div>
                        <h3>
                            <?= $user["username"] ?>
                        </h3>
                    </div>
                    <!-- Hide the delete button if the user is the current user -->
                    <button class="delete" <?= $user["username"] == $session["username"] ? "hidden" : "" ?>>Delete</button>
                </div>

            <?php } ?>
        </div>

        <div>
            <form method="post" id="newListItem">
                <input name="action" value="CREATE" hidden>
                <input name="withHTML" value="true" hidden>
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

            <!-- If there is an error, display it -->
            <?php if (isset($err)) { ?>
                <div id="error">
                    <?= $err ?>
                </div>
            <?php } ?>
        </div>

    </div>
</div>

<script src="/src/portal/users.js" type="module"></script>