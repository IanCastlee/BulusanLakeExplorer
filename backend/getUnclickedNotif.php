<?php
include("./header.php");
include("./conn.php");

$response = ['success' => false, 'error' => "", 'message' => "", 'count' => 0];

$userId = isset($_GET['userId']) ? $_GET['userId'] : null;
$status = "unclicked";

if ($userId) {
    // Query to count unclicked notifications
    $stmt_getUnlclikedNotif = $conn->prepare("SELECT COUNT(*) as notif_count FROM notifications WHERE status = ? AND reciever = ?");
    $stmt_getUnlclikedNotif->bind_param('si', $status, $userId);

    // Execute the query
    if ($stmt_getUnlclikedNotif->execute()) {
        $result = $stmt_getUnlclikedNotif->get_result();
        if ($row = $result->fetch_assoc()) {
            $response['success'] = true;
            $response['count'] = $row['notif_count'];
        }
    } else {
        $response['error'] = "Failed to execute query.";
    }
    $stmt_getUnlclikedNotif->close();
} else {
    $response['error'] = "Cant connect to frontend";
}

echo json_encode($response);
$conn->close();
