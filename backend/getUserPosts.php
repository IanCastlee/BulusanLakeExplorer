<?php
include("./header.php");
include("./conn.php");

$userId =  isset($_GET['userid']) ?  $_GET['userid'] : null;

$stmt = $conn->prepare("SELECT * FROM images WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result =  $stmt->get_result();

$myposts = [];

while ($row = $result->fetch_assoc()) {
    $myposts[] = $row;
}


$response['myposts'] = $myposts;
$stmt->close();

echo json_encode($response);
$conn->close();
