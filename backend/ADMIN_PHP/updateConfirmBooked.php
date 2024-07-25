<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

include("./conn.php");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['booked_id'])) {
    $booked_id = $data['booked_id'];
    $status = "pending";

    $query = "UPDATE booking SET status = ? WHERE booked_id = ?";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('si', $status, $booked_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to execute statement']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to prepare statement']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
}

$conn->close();
