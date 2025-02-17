<?php
include("./header.php");
include("./conn.php");

header('Content-Type: application/json');

session_start();
// $currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$currentUserId = $_GET['userId'] ? $_GET['userId'] : null;

$response = ["success" => false, "errors" => [], "posts" => []];

$query = "SELECT p.*, i.image_path, i.status, u.user_id, u.username, u.profilePic,
           (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count,
           (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) AS likes_count,
           (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id AND l.user_id = ?) AS user_liked
    FROM posts p 
    JOIN users u ON u.user_id = p.user_id
    LEFT JOIN images i ON p.post_id = i.post_id 
    WHERE p.status = 'public' AND  i.status = 1 AND p.user_id = ?
    ORDER BY p.createdAt DESC
";
$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $currentUserId, $currentUserId);
$stmt->execute();
$result = $stmt->get_result();

$posts = []; // Initialize the posts array

while ($row = $result->fetch_assoc()) {
    $postId = $row['post_id'];
    if (!isset($posts[$postId])) {
        $posts[$postId] = [
            'post_id' => $postId,
            'username' => $row['username'],
            'profilePic' => $row['profilePic'],
            'caption' => $row['caption'],
            'status' => $row['status'],
            'user_id' => $row['user_id'],
            'createdAt' => $row['createdAt'],
            'likes_count' => $row['likes_count'],
            'comment_count' => $row['comment_count'], // Add comment count here
            'user_liked' => $row['user_liked'] > 0,
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
