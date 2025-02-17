<?php
include("./header.php");
header('Content-Type: application/json');
include("./conn.php");

session_start();
$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$act_id = isset($_GET['id']) ? $_GET['id'] : '';

if (empty($act_id)) {
    echo json_encode(array("message" => "No activity ID provided."));
    exit();
}

$get_act_details = mysqli_query($conn, "SELECT * FROM activities WHERE act_id = '$act_id'");
$activityData = mysqli_fetch_assoc($get_act_details);

if ($activityData) {
    echo json_encode([
        "userid" => $userid,
        "actid" => $activityData
    ]);
} else {
    echo json_encode(array("message" => "Activity not found."));
}
