<?php

include("./header.php");
include("./conn.php");

session_start();
$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;


$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $post_id = isset($_POST['post_id']) ? $_POST['post_id'] : '';

    $deletePost = mysqli_query($conn, "DELETE FROM posts WHERE post_id = '$post_id'");
    if ($deletePost) {
        $response['success'] = true;
    } else {
        $response['error'] = "Failed to delete post" . mysqli_error($conn);
    }
} else {
    $response['error'] = "Failed to get post id ";
}

echo json_encode($response);
$conn->close();
