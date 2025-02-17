<?php
include("../header.php");
include("../conn.php");

$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $announ_id = $_POST['announ_id'];
    $title = $_POST['title'];
    $announcement = $_POST['announcement'];
    $date = $_POST['date'];

    $stmt = $conn->prepare("UPDATE announcement SET ttl = ?, announcement = ?, date = ? WHERE announcement_id = ?");
    if ($stmt) {
        $stmt->bind_param("sssi", $title, $announcement, $date, $announ_id);
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = "Failed to update announcement: " . $stmt->error;
        }
        $stmt->close();
    } else {
        $response['error'] = "Failed to prepare statement: " . $conn->error;
    }
} else {
    $response['error'] = "Invalid request method";
}

echo json_encode($response);

$conn->close();
