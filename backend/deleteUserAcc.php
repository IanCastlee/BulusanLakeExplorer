<?php

include("./header.php");
include("./conn.php");

session_start();
$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;


$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $id = isset($_POST['id']) ? $_POST['id'] : '';
    $status = 0;

    $stmt_update = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
    $stmt_update->bind_param("ii", $status, $id);

    if ($stmt_update->execute()) {
        $response['success'] = true;
        $response['message'] = "Successss";
    } else {
        $response['error'] = "Unable to update";
    }
} else {
    $response['error'] = "Failed to get post id ";
}

echo json_encode($response);
$conn->close();
