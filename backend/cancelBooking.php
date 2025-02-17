<?php
include("./header.php");
include("./conn.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $booked_id = $_POST['booked_id'];
    $booked_date = $_POST['booked_date'];
    $user_id = $_POST['user_id'];
    $name = $_POST['name'];
    $createdAt = date("Y-m-d H:i:s");

    $status = "canceled";

    $response = [];

    $query = "UPDATE booking SET status = ? WHERE booked_id = ?";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('si', $status, $booked_id);

        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
            $response['error'] = 'Failed to execute statement';
        }

        $stmt->close();
    } else {
        $response['success'] = false;
        $response['error'] = 'Failed to prepare statement';
    }
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid input';
}

echo json_encode($response);

$conn->close();
