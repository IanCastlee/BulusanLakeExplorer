<?php
include("../header.php");
include("../conn.php");


$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['user_id'])) {
    $user_id = $data['user_id'];
    $status = 1;

    $query = "UPDATE users  SET status = ? WHERE user_id = ?";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('si', $status, $user_id);

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
