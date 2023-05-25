<?php
// This file is the router for the api. It will route the request to the correct file.

// Get the path of the request
$path = $_SERVER['REQUEST_URI'];

// Removes the slash in the end if it exists
str_ends_with($path, "/") && $path = substr($path, 0, -1);

// If there is no path, set it to home
if ($path == "")
    $path = "/home";

// Define the public directory and the path to the requested file
$public_dir = dirname(__DIR__, 1) . "/public";
$public_path = $public_dir . $path;

// If the file exists in the public directory, serve it
if (file_exists($public_path)) {
    // Get the extension of the file
    $ext = pathinfo($public_path, PATHINFO_EXTENSION);

    // Set the content type depending on the extension
    switch ($ext) {
        case 'jfif':
        case 'jpg':
        case 'jpeg':
            $content_type = "image/jpeg";
            break;

        case 'png':
            $content_type = "image/png";
            break;

        case 'json':
            $content_type = "text/plain";
            break;

        case 'js':
            $content_type = "text/javascript";
            break;

        case 'css':
            $content_type = "text/css";
            break;

        default:
            // If the extension is not supported, return 501
            http_response_code(501);
            exit;
    }

    // Set the content type header
    header("Content-type:" . $content_type . ";");

    // Serve the file
    readfile($public_path);

    exit;
}

// If the path starts with /portal, run the portal router
if (str_starts_with($path, "/portal")) {
    include __DIR__ . "/portal/router.php";
    exit;
}

$page = null;

// Get the page with the slug of the path
$connection = require __DIR__ . "/db.php";
$r = $connection->query("SELECT * FROM w_pages WHERE slug='" . str_replace("/", "", $path) . "'");
// Set the page variable
$page = $r->fetch_assoc();

// If the page is null, return 404
if ($page == null) {
    http_response_code(404);
    include __DIR__ . "/404.php";
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?= $page["title"] ?>
    </title>
    <link href="/styles/index.css" type="text/css" rel="stylesheet">
</head>

<body>
    <?= $page["html"] ?>
</body>

</html>