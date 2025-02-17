<?php
include("../header.php");
include("../conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $booked_id = $_POST['booked_id'];

    $status = "reserved";

    $query = "UPDATE booking SET status = ? WHERE booked_id = ?";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('si', $status, $booked_id);

        if ($stmt->execute()) {

            echo json_encode([
                'success' => true,
                'message' => 'Notification sent'
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to execute statement']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to prepare statement']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}

$conn->close();
