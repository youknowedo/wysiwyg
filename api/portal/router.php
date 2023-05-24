<?php
session_start();

$connection = require __DIR__ . "/../db.php";
$r = $connection->query("SELECT * FROM w_sessions WHERE id='" . session_id() . "'");
$session = $r->fetch_assoc();

if (!$session) {
    $r = $connection->query("INSERT INTO w_sessions (
                            id,
                            username
                        ) VALUES (
                            '" . session_id() . "',
                            NULL
                            )");
}

$r = $connection->query("SELECT * FROM w_sessions WHERE id='" . session_id() . "'");
$session = $r->fetch_assoc();

if (!isset($session["username"]) && $path != "/portal/login") {
    header("Location:/portal/login");
    exit;
} else if (isset($session["username"]) && $path == "/portal/login") {
    header("Location:/portal");
    exit;
} else {
    if ($path == "/portal/edit") {
        header("Location:edit/home");
        exit;
    }


    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        ?>

            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>WYSIWYG Portal</title>
                <link href="/styles/portal/index.css" type="text/css" rel="stylesheet">
                <link href=<?php
                if (str_starts_with($path, "/portal/edit"))
                    echo '"/styles/portal/edit/index.css\"';

                ?> type="text/css" rel="stylesheet">
            </head>

            <body>
            <?php
    }

    switch ($path) {
        case "/portal":
            include __DIR__ . "/portal.php";
            break;
        case "/portal/pages":
            include __DIR__ . "/pages.php";
            break;
        case str_starts_with($path, "/portal/edit") ? $path : "":
            include __DIR__ . "/edit.php";
            break;
        case "/portal/users":
            include __DIR__ . "/users.php";
            break;
        case "/portal/login":
            include __DIR__ . "/login.php";
            break;
        case "/portal/logout":
            include __DIR__ . "/logout.php";
            break;
        default:
            include __DIR__ . "/404.php";
    }


    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        ?>
            </body>

            </html>
        <?php
    }
}