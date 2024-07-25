<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$canceled = 'canceled';

if ($stmt = $conn->prepare("SELECT b.*, a.name  FROM booking AS b JOIN activities AS a ON b.act_id = a.act_id WHERE b.status = ? AND b.user_id != ?")) {
  $stmt->bind_param("si", $canceled, $currentUserId);
  $stmt->execute();
  $result = $stmt->get_result();

  $notifications = [];

  while ($row = $result->fetch_assoc()) {
    $message = "Hey, There was a user who canceled their " . $row['name'] . " booking (booked for " . $row['booked_date'] . ")";
    $notifications[] = [
      'bookedid' => $row['booked_id'],
      'message' => $message,
    ];
  }
  echo json_encode($notifications);
  $stmt->close();
} else {
  echo json_encode(['error' => "Failed to fetch data"]);
}

$conn->close();
