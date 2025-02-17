<?php
include("../header.php");
include("../conn.php");

$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act_id = $_POST['act_id'];
    $status = "not active";


    $stmt = $conn->prepare("UPDATE activities SET status = ?  WHERE act_id = ?");
    if ($stmt) {
        $stmt->bind_param("si", $status, $act_id);
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = "Failed to update announcement: " . $stmt->error;
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
