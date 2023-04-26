<?php
$path = substr($_SERVER['REQUEST_URI'], 0, -1);
($path == "/") && $path = "/home";
$public_path = dirname(__DIR__, 1) . "/public" . $path;

$db_file = "../public/temp_database.json";
$db = json_decode(file_get_contents($db_file), true);


if (file_exists($public_path)) {
    if (str_ends_with($public_path, ".jfif") || str_ends_with($public_path, ".jpg") || str_ends_with($public_path, ".jpeg"))
        $content_type = "image/jpeg";
    if (str_ends_with($public_path, ".png"))
        $content_type = "image/png";
    if (str_ends_with($public_path, ".json"))
        $content_type = "text/json";

    if ($content_type != null) {
        header("Content-type:" . $content_type . ";");
    }
    readfile($public_path);
} else {
    $page = null;

    $num_of_pages = count($db);
    for ($i = 0; $i < $num_of_pages; $i++) {
        if ($db[$i]["slug"] == $path)
            $page = $db[$i];
    }

    if ($page == null) {
        echo "404";
        http_response_code(404);
        die();
    }

    function generateComponent($json_component)
    {
        $children = "";

        $num_of_children = count($json_component["children"]);
        for ($i = 0; $i < $num_of_children; $i++) {
            $child = $json_component["children"][$i];
            if (is_string($child))
                $children = $children . $child;
            else
                $children = $children . generateComponent($child);
        }

        return "<" . $json_component["type"] . ">" . $children . "</" . $json_component["type"] . ">";
    }

    $body_HTML = "";

    $body_children = $page["body"]["children"];
    $num_of_children = count($body_children);
    for ($i = 0; $i < $num_of_children; $i++) {
        $body_HTML = $body_HTML . generateComponent($body_children[$i]);
    }

    echo $body_HTML;
}


?>