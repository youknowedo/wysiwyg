<?php
$connection = require __DIR__ . "/db.php";

$r = $connection->query("update w_pages set html='' where slug='home'");

echo $r;
echo $connection->error;