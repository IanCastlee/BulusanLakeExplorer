<?php
include("../header.php");
include("../conn.php");

$response = ["success" => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $announcement = isset($_POST['announcement']) ? $_POST['announcement'] : null;
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $date = isset($_POST['date']) ? $_POST['date'] : null;
    $createdAt = date("Y-m-d H:i:s");
    $status = 'Active announcement';


    $response['a'] = $announcement;
    if ($announcement) {
        $stmt = $conn->prepare("INSERT INTO announcement (ttl, announcement, status, createdAt, date )VALUES(?, ?, ?, ?, ?)");
        $stmt->bind_param('sssss', $title, $announcement, $status, $createdAt, $date);
        if ($stmt->execute()) {
            $response['success'] = true;
        }
    }
    $stmt->close();
} else {
    $response['error'] = "Unable to insert bio type";
}

echo json_encode($response);

$conn->close();
