<?php

$method = $_SERVER['REQUEST_METHOD'];


if ($method == "POST") {
    $path = $_SERVER['REQUEST_URI'];
    str_ends_with($path, "/") && $path = substr($path, 0, -1);


    $newPage = file_get_contents('php://input');

    $public_dir = dirname(__DIR__, 1) . "/../public";

    $db = json_decode(file_get_contents($db_file), true);
    $db[str_replace("/portal/edit/", "", $path)] = $newPage;
    echo json_encode($db);

    $db_file = fopen($public_dir . "/temp_database.json", "w") or die("Unable to open file!");
    fwrite($db_file, json_encode($db));
    fclose($db_file);
}
?>

<?php if ($method == "GET"): ?>
    <div id="banner">
        <div id="tools">
            <div class="left"></div>
            <div class="right">
                <button id="saveButton">Sav</button>
            </div>
        </div>
        <div id="modeSelector"></div>
    </div>

    <script type="module" src="/src/portal/edit/edit.js"></script>

    <div id="editor">
        <div class="left menu"></div>

        <div>
            <iframe id="page"></iframe>
        </div>

        <div class="right menu"></div>
    </div>
<?php endif; ?>