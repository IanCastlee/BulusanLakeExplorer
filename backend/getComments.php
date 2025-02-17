<?php
include("./header.php");
include("./conn.php");


$post_id = isset($_GET['post_id']) ? $_GET['post_id'] : null;

$response['pid'] = $post_id;
if ($stmt =  $conn->prepare("SELECT c.*, u.user_id, u.username,u.profilePic, p.post_id FROM comments AS c JOIN posts AS p ON c.post_id = p.post_id JOIN users AS u  ON u.user_id = c.user_id WHERE c.post_id = ?  ORDER BY c.createdAt DESC")) {

    $stmt->bind_param("i", $post_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }

    $response['comments'] = $comments;
    $stmt->close();
} else {
    $response['error'] = "Error in fetching data";
}

echo json_encode($response);
$conn->close();
