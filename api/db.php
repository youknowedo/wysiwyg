<?php

$host = "aws.connect.psdb.cloud";

// Get the database credentials from the environment variables
$user = getenv("DB_USER");
$password = getenv("DB_PWD");

// Create a MySQL connection
$connection = mysqli_init();
// Set the SSL options
$connection->ssl_set(NULL, NULL, __DIR__ . "/../ca.pem", NULL, NULL);
// Connect to the database
$connection->real_connect($host, $user, $password, "wysiwyg");

// If there is an error, exit
if ($connection->connect_errno) {
    exit("Connection error: " . $connection->connect_error);
}

// Return the connection
return $connection;