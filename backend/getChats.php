<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$otherUserId   = isset($_GET['userid']) ? $_GET['userid'] : 0;


$response['currid'] = $currentUserId;
if ($stmt = $conn->prepare("SELECT c.*, u.fullname, u.profilePic FROM chats AS c JOIN users AS u ON c.user_id =  u.user_id  WHERE (c.user_id = ? AND reciever = ?) OR (c.user_id = ? AND reciever = ?) ORDER BY c.msg_id ASC")) {
    $stmt->bind_param("iiii", $currentUserId, $otherUserId, $otherUserId, $currentUserId);
    $stmt->execute();
    $result = $stmt->get_result();

    $chats = [];

    while ($row = $result->fetch_assoc()) {
        $chats[] = $row;
    }

    $response['chats'] = $chats;
    $stmt->close();
} else {
    $response['error'] = "Failed to prepare the SQL statement";
}

echo json_encode($response);
$conn->close();
