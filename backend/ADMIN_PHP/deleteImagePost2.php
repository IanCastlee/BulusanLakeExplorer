<?php

include("../header.php");
include("../conn.php");


$response = ['success' => false, 'error' => "", 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $image_id = isset($_POST['image_id']) ? $_POST['image_id'] : null;


    $deletePost = mysqli_query($conn, "UPDATE images SET status = 0 WHERE image_id = '$image_id'");
    if ($deletePost) {
        $response = ['success' => true, 'message' => "Succesfully deleted"];
    } else {
        $response = ['success' => false];
    }
} else {
    $response['error'] = "Failed to get post id ";
}

echo json_encode($response);
$conn->close();
