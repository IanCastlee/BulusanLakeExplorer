<?php

include("./header.php");
include("./conn.php");

$response = ['success' => false];

if (isset($_GET['msg_id'])) {
    $msg_id = $_GET['msg_id'];

    $deleteMessage = mysqli_prepare($conn, "DELETE FROM chats WHERE msg_id = ?");
    mysqli_stmt_bind_param($deleteMessage, 'i', $msg_id);
    $result = mysqli_stmt_execute($deleteMessage);

    if ($result) {
        $response['success'] = true;
    } else {
        $response['error'] = "Failed to delete message: " . mysqli_error($conn);
    }

    mysqli_stmt_close($deleteMessage);
} else {
    $response['error'] = "Message ID not provided";
}

echo json_encode($response);
$conn->close();
