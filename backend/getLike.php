<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$response = ["success" => false, "errors" => []];


if ($stmt = $conn->prepare("SELECT * FROM likes")) {
    $stmt->execute();
    $res = $stmt->get_result();

    $likes = [];

    while ($row = $res->fetch_assoc()) {
        $likes[] = $row;
    }

    $response['likes'] = $likes;

    $stmt->close();
} else {
    $response['error'] = "Failed to fetch likes ";
}

echo json_encode($response);

$conn->close();
