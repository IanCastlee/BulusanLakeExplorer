<?php
include("./header.php");
include("./conn.php");

session_start();
$reporter_id = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $reported_id = $_POST['user_id'] ? $_POST['user_id'] : null;
    $post_id = $_POST['post_id'] ? $_POST['post_id'] : null;
    $report = $_POST['report'] ? $_POST['report'] : null;
    $createdAt = date("Y-m-d H:i:s");

    $stmt_check = $conn->prepare("SELECT * FROM reports WHERE  reporter_id = ?  AND post_id = ?");
    $stmt_check->bind_param("ii", $reporter_id, $post_id);
    $stmt_check->execute();
    $result = $stmt_check->get_result();

    if ($result->num_rows > 0) {
        $response['message'] = "You've already reported this post.";
    } else {

        if ($reported_id && $post_id && $report) {

            $stmt = $conn->prepare("INSERT INTO reports (reporter_id, reported_id,post_id, reason, createdAt)VALUES(?,?,?,?,?)");
            $stmt->bind_param("iiiss", $reporter_id, $reported_id, $post_id, $report, $createdAt);
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = "Report sent. Thank you for your concern.";
            } else {
                $response['error'] = "Failed to insert data";
            }
        } else {
            $response['error'] = "UserID or PostId is empty";
        }
    }
} else {
    $response['error'] = "Invalid request";
}

$conn->close();
echo json_encode($response);
