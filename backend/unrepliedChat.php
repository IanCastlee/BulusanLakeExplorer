<?php

include("./header.php");
include("./conn.php");

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $msg_id = isset($_POST['msg_id']) ? $_POST['msg_id'] : null;

    if ($msg_id) {
        $status = 0;

        // Prepare the SQL update statement
        $stmt_update = $conn->prepare("UPDATE chats SET notanswered = ? WHERE msg_id = ?");
        $stmt_update->bind_param("ii", $status, $msg_id);

        // Execute the update and check the result
        if ($stmt_update->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = "Failed to update message: " . $stmt_update->error;
        }

        // Close the prepared statement
        $stmt_update->close();
    } else {
        $response['error'] = "Message ID not provided";
    }
}

echo json_encode($response);
$conn->close();
