<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$response = ["success" => false, "errors" => []];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act_id = $_POST['act_id'];
    $review = $_POST['review'];
    $rating = $_POST['rate'];
    $createdAt = date("Y-m-d H:i:s");

    if ($act_id && $review) {
        // Check if the user has already reviewed this activity
        $stmt_check = $conn->prepare("SELECT * FROM reviews WHERE user_id = ? AND act_id = ?");
        $stmt_check->bind_param("ii", $currentUserId, $act_id);
        $stmt_check->execute();
        $result = $stmt_check->get_result();

        if ($result->num_rows > 0) {
            $response['message'] = "You've already sent your feedback for this activity.";
        } else {
            $stmt = $conn->prepare("INSERT INTO reviews (user_id, act_id, review, rating, createdAt) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("iisis", $currentUserId, $act_id, $review, $rating, $createdAt);
            if ($stmt->execute()) {
                $response['success'] = true;
            } else {
                $response['errors'][] = "Failed to insert data";
            }

            $stmt->close();
        }
    } else {
        $response['errors'][] = "Feedback is required";
    }
} else {
    $response['errors'][] = "Invalid request method";
}

echo json_encode($response);
$conn->close();
