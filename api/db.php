<?php

$host = "aws.connect.psdb.cloud";
$user = getenv("DB_USER");
$password = getenv("DB_PWD");

$connection = mysqli_init();
$connection->ssl_set(NULL, NULL, __DIR__ . "/../ca.pem", NULL, NULL);
$connection->real_connect($host, $user, $password, "wysiwyg");

if ($connection->connect_errno) {
    exit("Connection error: " . $connection->connect_error);
}

return $connection;