<?php

include("./header.php");
include("./conn.php");

header("Content-Type: Application/json");
session_start();
session_unset();
session_destroy();

echo json_encode(['success' => true,  'message' => 'Log out succes']);
