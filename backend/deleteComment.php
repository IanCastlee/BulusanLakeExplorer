<?php

include("./header.php");
include("./conn.php");

session_start();
$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;


$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $comment_id = isset($_POST['comment_id']) ? $_POST['comment_id'] : '';

    $deletePost = mysqli_query($conn, "DELETE FROM comments WHERE comment_id = '$comment_id'");
    if ($deletePost) {
        $response['success'] = true;
    } else {
        $response['error'] = "Failed to delete comment" . mysqli_error($conn);
    }
} else {
    $response['error'] = "Failed to get post id ";
}

echo json_encode($response);
$conn->close();
