<?php
include("../header.php");
include("../conn.php");

session_start();

if ($stmt = $conn->prepare("SELECT c.*, u.fullname, ch.message, ch.createdAt FROM conversation AS c JOIN users AS u ON c.user_0 = u.user_id JOIN (SELECT convo_id, message, createdAt FROM chats AS ch1 WHERE ch1.msg_id = (SELECT MAX(ch2.msg_id) FROM chats AS ch2 WHERE ch2.convo_id = ch1.convo_id)) AS ch ON c.convo_id = ch.convo_id ORDER BY ch.createdAt DESC")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $convo = [];

    while ($row = $result->fetch_assoc()) {
        $convo[] = $row;
    }

    $response['convo'] = $convo;
    $stmt->close();
} else {
    $response['error'] = "Failed to prepare the SQL statement";
}

echo json_encode($response);
$conn->close();
