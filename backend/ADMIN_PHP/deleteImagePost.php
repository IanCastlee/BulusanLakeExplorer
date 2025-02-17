<?php

include("../header.php");
include("../conn.php");


$response = ['success' => false, 'error' => "", 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $image = isset($_POST['image']) ? $_POST['image'] : null;
    $image_id = isset($_POST['image_id']) ? $_POST['image_id'] : null;
    $reported_id = isset($_POST['reported_id']) ? $_POST['reported_id'] : null;
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $content = isset($_POST['body']) ? $_POST['body'] : null;
    $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null;
    $reason = isset($_POST['reason']) ? $_POST['reason'] : null;
    $currentDate = date('Y-m-d');
    $status = "unclicked";


    $deletePost = mysqli_query($conn, "UPDATE images SET status = 0 WHERE image_id = '$image_id'");
    if ($deletePost) {
        $deleteReport = mysqli_query($conn, "DELETE FROM reports WHERE reported_id = '$reported_id'");

        if ($deleteReport) {
            $stmt_insert_notif = $conn->prepare("INSERT INTO notifications (reciever, title, content,image_post, createdAT, status)VALUES(?,?,?,?,?,?)");
            $stmt_insert_notif->bind_param("isssss", $user_id, $title, $content, $image, $currentDate, $status);

            if ($stmt_insert_notif->execute()) {
                $response = ['success' => true, 'message' => "Notification succesfully added"];
            } else {
                $response = ['success' => false, 'error' => "Can't Insert Data"];
            }
        } else {
            $response['success'] = false;
        }
    } else {
        $response['error'] = "Failed to delete post" . mysqli_error($conn);
    }
} else {
    $response['error'] = "Failed to get post id ";
}

echo json_encode($response);
$conn->close();
