<?php

$connection = require __DIR__ . "/../db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (empty($_POST["username"])) {
        http_response_code(400);
        die("Username is required");
    }

    if (strlen($_POST["password"]) < 8) {
        http_response_code(400);
        die("Password must be more than 8 characters");
    }
    if (!preg_match("/[a-z]/i", $_POST["password"])) {
        http_response_code(400);
        die("Password must contain one letter");
    }
    if (!preg_match("/[0-9]/i", $_POST["password"])) {
        http_response_code(400);
        die("Password must contain one number");
    }
    if ($_POST["password"] !== $_POST["repeat"]) {
        http_response_code(400);
        die("Passwords must match");
    }

    $connection->query("CREATE TABLE w_users(
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(24) UNIQUE,
        password_hash VARCHAR(255)
    )");

    $sql = "INSERT INTO w_users (username,password_hash)
        VALUES (?,?)";

    $stmt = $connection->stmt_init();
    if (!$stmt->prepare($sql)) {
        http_response_code(500);
        die("SQL Error: " . $connection->error);
    }

    $password_hash = password_hash($_POST["password"], PASSWORD_DEFAULT);

    $stmt->bind_param(
        "ss",
        $_POST["username"],
        $password_hash
    );

    if ($stmt->execute())
        echo "User created";
    else {
        if ($connection->errno === 1062)
            die("Username already taken");
        else
            die($connection->error . " " . $connection->errno);
    }

    exit;
}

?>
<div>
    <form method="post">
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

        <input type="submit" value="Create User">
    </form>
</div>

<?php

print_r($_SESSION);

$result = $connection->query("SELECT * FROM w_users");

while ($user = $result->fetch_assoc()) {
    echo $user["username"];
}
?>

<script type="module" src="/src/portal/users.js"></script>