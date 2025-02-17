<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$response = ["success" => false, "errors" => [], "liked" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $post_id = $_POST['post_id'];
    $createdAt = date("Y-m-d H:i:s");

    // Check if the like already exists
    $stmt = $conn->prepare("SELECT * FROM likes WHERE user_id = ? AND post_id = ?");
    $stmt->bind_param("ii", $currentUserId, $post_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows() > 0) {
        // Like exists, delete it
        $stmt->close();
        $stmt = $conn->prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?");
        $stmt->bind_param("ii", $currentUserId, $post_id);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['liked'] = false; // Indicate the like was removed
        } else {
            $response['errors'][] = "Failed to delete like";
        }
    } else {
        // Like does not exist, insert it
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO likes (user_id, post_id, createdAt) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $currentUserId, $post_id, $createdAt);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['liked'] = true; // Indicate the like was added
        } else {
            $response['errors'][] = "Failed to insert like";
        }
    }

    $stmt->close();
} else {
    $response['errors'][] = "Invalid request method.";
}

echo json_encode($response);
$conn->close();
