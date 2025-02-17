<?php
include("./header.php");
include("./conn.php");

$postID = isset($_GET['post_id']) ? $_GET['post_id'] : "";
$response = ["success" => false, "errors" => [], "post" => []];

if (empty($postID)) {
    $response['errors'][] = "No post ID provided";
    echo json_encode($response);
    exit();
}

if ($stmt = $conn->prepare("SELECT p.post_id, p.caption, p.status, p.createdAt, i.image_path, i.status, u.user_id, u.username
    FROM posts p
    JOIN users u ON u.user_id = p.user_id
    LEFT JOIN images i ON p.post_id = i.post_id
    WHERE p.post_id = ?  AND  i.status = 1")) {
    $stmt->bind_param("i", $postID);
    $stmt->execute();
    $result = $stmt->get_result();

    $postDetails = [];
    while ($row = $result->fetch_assoc()) {
        $postDetails[] = $row;
    }

    if (count($postDetails) > 0) {
        $response['success'] = true;
        $response['post'] = $postDetails;
    } else {
        $response['errors'][] = "Post not found";
    }

    $stmt->close();
} else {
    $response['errors'][] = "Failed to prepare the SQL statement";
}

echo json_encode($response);
