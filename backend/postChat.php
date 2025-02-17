<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$response = ["success" => false, "error" => []];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $message = isset($_POST['msgdata']) ? $_POST['msgdata'] : null;
    $msgdataChatBot = isset($_POST['msgdataChatBot']) ? $_POST['msgdataChatBot'] : null;
    $selectedUserId = $_POST['selectedUserId'];
    $createdAt = date("Y-m-d H:i:s");
    $convo_id = null;

    // Determine the sender and message based on whether it's the user or chatbot
    if ($msgdataChatBot) {
        $senderUserId = 27; // The chatbot's user ID
        $receiverUserId = $currentUserId;
        $message = $msgdataChatBot;
    } else {
        $senderUserId = $currentUserId;
        $receiverUserId = $selectedUserId;
    }

    // Check for existing conversation
    $stmt = $conn->prepare("SELECT convo_id FROM conversation WHERE (user_0 = ? AND user_1 = ?) OR (user_0 = ? AND user_1 = ?)");
    $stmt->bind_param("iiii", $senderUserId, $receiverUserId, $receiverUserId, $senderUserId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // If a conversation exists, get the convo_id
        $row = $result->fetch_assoc();
        $convo_id = $row['convo_id'];
    } else {
        // No conversation exists, create a new one
        $stmt = $conn->prepare("INSERT INTO conversation (user_1, user_0, createdAt) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $receiverUserId, $senderUserId, $createdAt);
        if ($stmt->execute()) {
            $convo_id = $stmt->insert_id; // Get the ID of the newly created conversation
        } else {
            $response['error'][] = "Conversation creation failed: " . htmlspecialchars($stmt->error);
        }
        $stmt->close();
    }

    // Insert the chat message
    if ($convo_id !== null) {
        $stmt = $conn->prepare("INSERT INTO chats (convo_id, user_id, reciever, message, createdAt) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iiiss", $convo_id, $senderUserId, $receiverUserId, $message, $createdAt);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = "Successfully sent";
        } else {
            $response['error'][] = "Message insertion failed: " . htmlspecialchars($stmt->error);
        }
        $stmt->close();
    }
}

echo json_encode($response);
