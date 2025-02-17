<?php
include("../header.php");
include("../conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : null;
$userid   = isset($_GET['userid']) ? $_GET['userid'] : null;
$status = 0;



$response['currid'] = $currentUserId;
if ($stmt = $conn->prepare("SELECT * FROM chats WHERE notanswered = ? AND user_id = ?")) {
    $stmt->bind_param("ii", $status, $userid);
    $stmt->execute();
    $result = $stmt->get_result();

    $chats = [];

    while ($row = $result->fetch_assoc()) {
        $chats[] = $row;
    }

    $response['chats'] = $chats;
    $response['user_id'] = $userid;
    $stmt->close();
} else {
    $response['error'] = "Failed to prepare the SQL statement";
}

echo json_encode($response);
$conn->close();
