<?php

$connection = require __DIR__ . "/../db.php";
$connection->query("UPDATE w_sessions
                    SET username=NULL
                    WHERE id='" . session_id() . "' 
                    ");

header("Location:/portal/login");
exit;