<?php
$path = $_SERVER['REQUEST_URI'];

str_ends_with($path, "/") && $path = substr($path, 0, -1);
($path == "/") && $path = "/home";

$static_path = dirname(__DIR__, 1) . "/static" . $path;

$db_file = "../static/temp_database.json";
$db = json_decode(file_get_contents($db_file), true);

function renderPage($db, $path)
{
    $page = null;

    foreach ($db as $key => $html) {
        if ("/" . $key == $path)
            $page = $html;
    }

    if ($page == null) {
        include "404.php";
        http_response_code(404);
        die();
    }

    echo $page;
}

if (file_exists($static_path)) {
    if (str_ends_with($static_path, ".jfif") || str_ends_with($static_path, ".jpg") || str_ends_with($static_path, ".jpeg"))
        $content_type = "image/jpeg";
    if (str_ends_with($static_path, ".png"))
        $content_type = "image/png";
    if (str_ends_with($static_path, ".json"))
        $content_type = "text/plain";
    if (str_ends_with($static_path, ".js"))
        $content_type = "text/javascript";
    if (str_ends_with($static_path, ".css"))
        $content_type = "text/css";

    if ($content_type != null) {
        header("Content-type:" . $content_type . ";");
    }
    readfile($static_path);
    die();
}

if (str_starts_with($path, "/portal")) {
    if ($path == "/portal/edit") {
        header("Location:edit/home");
        die();
    }

    if (str_starts_with($path, "/portal/edit"))
        include "portal/edit.php";

    include "portal/styles.php";
} else {
    renderPage($db, $path);
}
?>