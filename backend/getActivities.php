<?php
include("./header.php");
header('Content-Type: application/json');

// Include your database connection
include("./conn.php");

$getAct = mysqli_query($conn, "SELECT * FROM activities");
$activities = [];

while ($row = mysqli_fetch_assoc($getAct)) {
    $activities[] = $row;
}

echo json_encode($activities);
