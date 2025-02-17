<?php
include("../header.php");
include("../conn.php");

$response = ['success' => false, 'error' => "", 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === "POST") {




    $post_id = isset($_POST['post_id']) ? $_POST['post_id'] : null;
    $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null;
    $image_id = isset($_POST['image_id']) ? $_POST['image_id'] : null;
    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $caption = isset($_POST['caption']) ? $_POST['caption'] : null;
    $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null;
    $reason = isset($_POST['reason']) ? $_POST['reason'] : null;
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $content = isset($_POST['body']) ? $_POST['body'] : null;


    $currentDate = date('Y-m-d');
    $status = "unclicked";

    if ($post_id) {
        $stmt = $conn->prepare("UPDATE posts SET caption = NULL WHERE post_id = ?");
        $stmt->bind_param("i", $post_id);
        if ($stmt->execute()) {

            $stmt_insert_notif = $conn->prepare("INSERT INTO notifications (reciever, title, content,caption, createdAT, status)VALUES(?,?,?,?,?,?)");
            $stmt_insert_notif->bind_param("isssss", $user_id, $title, $content, $caption, $currentDate, $status);

            if ($stmt_insert_notif->execute()) {
                $response = ['success' => true, 'message' => "Notification succesfully added"];
                $response = ['success' => true, 'message' => "Caption removed successfully"];
            } else {
                $response = ['success' => false, 'error' => "Can't Insert Data"];
            }
        } else {
            $response = ['success' => false, 'error' => "Failed to remove caption"];
        }
        $stmt->close();
    } else {
        $response = ['success' => false, 'error' => "Data from client is empty"];
    }
} else {
    $response = ['success' => false, 'error' => "Can't connect to client"];
}

echo json_encode($response);

$conn->close();
