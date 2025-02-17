<?php
include("../header.php");
include("../conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $userID = $_POST['userID'];
    $title = $_POST['title'];
    $body = $_POST['body'];
    $createdAt = date("Y-m-d H:i:s");
    $isCliked = "uncliked";
    $booked_id = $_POST['booked_id'];
    $status = "reserved";
    $sender = 27;

    $query = "UPDATE booking SET status = ? WHERE booked_id = ?";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('si', $status, $booked_id);

        if ($stmt->execute()) {

            if ($userID && $currentUserId) {
                $stmt_insetNotif = $conn->prepare("INSERT INTO notifications (sender, reciever, title, content, createdAt, status)VALUES(?,?,?,?,?,?)");
                $stmt_insetNotif->bind_param("iissss", $currentUserId, $userID, $title, $body, $createdAt, $isCliked);

                if ($stmt_insetNotif->execute()) {
                    // Combine all responses into one
                    echo json_encode([
                        'success' => true,
                        'message' => 'Notification sent'
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'error' => 'Failed to send notification'
                    ]);
                }
            } else {
                echo json_encode(['success' => false, 'error' => 'Sender or receiver ID is empty']);
            }
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
