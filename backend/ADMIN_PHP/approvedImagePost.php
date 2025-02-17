<?php

include("../header.php");
include("../conn.php");


$response = ['success' => false, 'error' => "", 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {


    $image_id = isset($_POST['image_id']) ? $_POST['image_id'] : null;
    $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null;
    $post_id = isset($_POST['post_id']) ? $_POST['post_id'] : null;
    $image = isset($_POST['image']) ? $_POST['image'] : null;
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $content = isset($_POST['body']) ? $_POST['body'] : null;

    $currentDate = date('Y-m-d');
    $status = "unclicked";

    $deletePost = mysqli_query($conn, "UPDATE images SET status = 1 WHERE image_id = '$image_id'");

    if ($deletePost) {

        $checkIfExisting =  $conn->prepare("SELECT * FROM  notifications WHERE image_id = ? ");
        $checkIfExisting->bind_param("i", $post_id);
        $checkIfExisting->execute();
        $checkIfExisting->store_result();

        if ($checkIfExisting->num_rows() < 1) {
            $stmt_insert_notif = $conn->prepare("INSERT INTO notifications (reciever, title, content,image_post, image_id, createdAT, status)VALUES(?,?,?,?,?,?,?)");
            $stmt_insert_notif->bind_param("isssiss", $user_id, $title, $content, $image, $post_id, $currentDate, $status);

            if ($stmt_insert_notif->execute()) {
                $response = ['success' => true, 'message' => "Notification succesfully added"];
            } else {
                $response = ['success' => false, 'error' => "Can't Insert Data"];
            }
        }
    } else {
        $response['success'] = false;
    }
} else {
    $response['error'] = "Failed to get post id ";
}

echo json_encode($response);
$conn->close();
