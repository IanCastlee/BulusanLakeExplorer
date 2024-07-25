<?php

include("./header.php");


header("Content-Type: Application/json");

include("./conn.php");

session_start();
session_unset();
session_destroy();

echo json_encode(['success' => true,  'message' => 'Log out succes']);
