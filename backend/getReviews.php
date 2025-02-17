<?php
include("./header.php");
include("./conn.php");


$act_id = isset($_GET['act_id']) ? $_GET['act_id'] : null;

if ($stmt =  $conn->prepare("SELECT r.*, u.user_id, u.username, u.profilePic, a.act_id FROM reviews AS r JOIN activities AS a ON a.act_id = r.act_id JOIN users AS u  ON u.user_id = r.user_id WHERE r.act_id = ?  ORDER BY r.createdAt DESC")) {

    $stmt->bind_param("i", $act_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    $response['reviews'] = $reviews;
    $stmt->close();
} else {
    $response['error'] = "Error in fetching data";
}

echo json_encode($response);
$conn->close();
