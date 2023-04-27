<?php
if ($path == "/portal/edit") {
    header("Location:edit/home");
    die();
}
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

    if (str_starts_with($path, "/portal/edit"))
        include "portal/edit.php";

    ?>
</body>

</html>