<?php
include("../header.php");
include("../conn.php");

$response = ["success" => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['announ_id'])) {
        $announcement_id = $_POST['announ_id'];
        $status = 'Recent announcement';


        $response['id'] = $announcement_id;
        $stmt = $conn->prepare("UPDATE announcement SET status = ? WHERE announcement_id = ?");
        $stmt->bind_param('si', $status, $announcement_id);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['id'] = $announcement_id;
        } else {
            $response['error'] = "Failed to update status. Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        $response['error'] = "Announcement ID is not set.";
    }
} else {
    $response['error'] = "Invalid request method.";
}

echo json_encode($response);
$conn->close();
