<?php

// Include the database connection
$connection = require __DIR__ . "/../db.php";

// Update the username to NULL in the session
$connection->query("UPDATE w_sessions
                    SET username=NULL
                    WHERE id='" . session_id() . "' 
                    ");

// Redirect to the login page
header("Location:/portal/login");
exit;