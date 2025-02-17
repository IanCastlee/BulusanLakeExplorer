<?php
include("./header.php");
include("./conn.php");

$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $notif_id = $_POST['notif_id'];
    $status = "clicked";

    $stmt = $conn->prepare("UPDATE notifications SET status= ? WHERE notif_id = ?");
    if ($stmt) {
        $stmt->bind_param("si", $status, $notif_id);
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = "Failed to update: " . $stmt->error;
        }
        $stmt->close();
    } else {
        $response['error'] = "Failed to prepare statement: " . $conn->error;
    }
} else {
    $response['error'] = "Invalid request method";
}

echo json_encode($response);

$conn->close();
