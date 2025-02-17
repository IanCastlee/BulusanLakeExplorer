<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$response = ["success" => false, "errors" => []];


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $post_id = $_POST['post_id'];
    $comment = $_POST['comment'];
    $createdAt = date("Y-m-d H:i:s");

    if ($post_id && $comment) {

        $stmt =  $conn->prepare("INSERT INTO comments (user_id, post_id, comment, createdAt)VALUES(?,?,?,?) ");
        $stmt->bind_param("iiss", $currentUserId, $post_id, $comment, $createdAt);

        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['error'][] = "Failed to insert data";
        }

        $stmt->close();
    }
} else {
    $response['error'][] = "Failed to save post information.";
}

echo json_encode($response);
$conn->close();
