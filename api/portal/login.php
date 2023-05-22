<?php

$is_invalid = false;
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $connection = require __DIR__ . "/../db.php";

    $sql = sprintf("SELECT * FROM w_users
                    WHERE username = '%s'", $connection->real_escape_string($_POST["username"]));

    $result = $connection->query($sql);
    $user = $result->fetch_assoc();

    if ($user) {
        if (password_verify($_POST["password"], $user["password_hash"])) {
            $_SESSION["username"] = $_POST["username"];
            header("Location:/portal");
            exit;
        }
    }

    $is_invalid = true;
}

?>
<div>
    <?php if ($is_invalid): ?>
        <em>Login Invalid</em>
    <?php endif; ?>
    <form method="post">
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