<?php
$path = $_SERVER['REQUEST_URI'];

str_ends_with($path, "/") && $path = substr($path, 0, -1);

if ($path == "")
    $path = "/home";

$public_dir = dirname(__DIR__, 1) . "/public";
$public_path = $public_dir . $path;

$db_file = $public_dir . "/temp_database.json";
$db = json_decode(file_get_contents($db_file), true);

function renderPage($db, $path)
{
    $page = null;

    foreach ($db as $key => $html) {
        if ("/" . $key == $path)
            $page = $html;
    }

    if ($page == null) {
        include __DIR__ . "/404.php";
        http_response_code(404);
        die();
    }

    return <<<HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link href="/styles/index.css" type="text/css" rel="stylesheet">
    </head>
    <body>
        {$page}
    </body>
    </html>
    HTML;
}

if (file_exists($public_path)) {
    if (str_ends_with($public_path, ".jfif") || str_ends_with($public_path, ".jpg") || str_ends_with($public_path, ".jpeg"))
        $content_type = "image/jpeg";
    else if (str_ends_with($public_path, ".png"))
        $content_type = "image/png";
    else if (str_ends_with($public_path, ".json"))
        $content_type = "text/plain";
    else if (str_ends_with($public_path, ".js"))
        $content_type = "text/javascript";
    else if (str_ends_with($public_path, ".css"))
        $content_type = "text/css";
    else {
        http_response_code(501);
        die();
    }

    if ($content_type != null) {
        header("Content-type:" . $content_type . ";");
    }
    readfile($public_path);
    die();
}

if ($path == "/api") {
    include "api.php";
    exit;
}

if (str_starts_with($path, "/portal")) {
    include __DIR__ . "/portal/index.php";
} else {
    echo renderPage($db, $path);
}
?>