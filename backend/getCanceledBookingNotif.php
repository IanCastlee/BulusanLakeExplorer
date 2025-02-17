<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;

$response = [];

if ($stmt = $conn->prepare("SELECT  * FROM notifications WHERE reciever = ? ORDER BY notif_id DESC")) {
  $stmt->bind_param("i", $currentUserId);
  $stmt->execute();
  $result = $stmt->get_result();

  $notifications = [];

  while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
  }
  $response['notifications'] = $notifications;
  $stmt->close();
} else {
  $response['error'] = "Failed to fetch data";
}

echo json_encode($response);
$conn->close();
