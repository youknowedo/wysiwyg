<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the MySQL connection
    $connection = require __DIR__ . "/../db.php";

    // Get the user from the database
    $result = $connection->query("SELECT * FROM w_users
                    WHERE username = '" . $connection->real_escape_string($_POST["username"]) . "'");
    $user = $result->fetch_assoc();

    // If the user exists and the password is correct, update the username in the session
    if ($user) {
        if (password_verify($_POST["password"], $user["password_hash"])) {
            if (
                $connection->query("UPDATE w_sessions
                                    SET username='" . $_POST["username"] . "'
                                    WHERE id='" . session_id() . "' 
                                    ")
            ) {
                header("Location:/portal");
                exit;
            } else
                echo $connection->error;
        }
    }

    $is_invalid = true;
}

?>
<div>
    <!-- If the login is invalid, display an error message -->
    <?php if (isset($is_invalid)): ?>
        <em>Login Invalid</em>
    <?php endif; ?>

    <form method="post">
        <input name="withHTML" value="true" hidden>
        <div>
            <label for="username">Username</label>
            <input type="text" id="username" name="username"
                value="<?php htmlspecialchars($_POST["username"] ?? "") ?>">
        </div>

        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password">
        </div>

        <input type="submit" value="Login">
    </form>
</div>