<?php
include("./header.php");

include("./conn.php");

header('Content-Type: application/json');

$response = ["success" => false, "errors" => [], "posts" => []];

$query = "
    SELECT p.post_id, p.caption, p.status, p.createdAt, i.image_path, u.user_id, u.username
    FROM posts p JOIN users u ON u.user_id = p.user_id
    LEFT JOIN images i ON p.post_id = i.post_id WHERE p.status = 'public'
    ORDER BY p.createdAt DESC
";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $postId = $row['post_id'];
    if (!isset($posts[$postId])) {
        $posts[$postId] = [
            'post_id' => $postId,
            'username' => $row['username'],
            'caption' => $row['caption'],
            'status' => $row['status'],
            'createdAt' => $row['createdAt'],
            'images' => []
        ];
    }
    if ($row['image_path']) {
        $posts[$postId]['images'][] = $row['image_path'];
    }
}
$stmt->close();
$response['success'] = true;
$response['posts'] = array_values($posts);

echo json_encode($response);
