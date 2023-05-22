<?php
session_start();

if (!isset($_SESSION["username"]) && $path != "/portal/login") {
    header("Location:/portal/login");
    exit;
} else if (isset($_SESSION["username"]) && $path == "/portal/login") {
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

    if ($path == "/portal")
        include __DIR__ . "/portal.php";
    else if (str_starts_with($path, "/portal/edit"))
        include __DIR__ . "/edit.php";
    else if ($path == "/portal/users")
        include __DIR__ . "/users.php";
    else if ($path == "/portal/login")
        include __DIR__ . "/login.php";
    else if ($path == "/portal/logout")
        include __DIR__ . "/logout.php";
    else
        include __DIR__ . "/404.php";


    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        ?>
            </body>

            </html>
        <?php
    }
}