<?php

include("./header.php");
include("./conn.php");

session_start();
$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;


$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $review_id = isset($_POST['review_id']) ? $_POST['review_id'] : '';

    $deletePost = mysqli_query($conn, "DELETE FROM reviews WHERE review_id = '$review_id'");
    if ($deletePost) {
        $response['success'] = true;
    } else {
        $response['error'] = "Failed to delete review" . mysqli_error($conn);
    }
} else {
    $response['error'] = "Failed to get post id ";
}

echo json_encode($response);
$conn->close();
