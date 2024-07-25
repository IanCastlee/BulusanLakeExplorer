<?php
include("../header.php");
include("../conn.php");

session_start();

if ($stmt = $conn->prepare("SELECT c.*, u.fullname FROM  conversation AS c JOIN  users AS u ON c.user_0 = u.user_id")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $connectedUser = [];

    while ($row = $result->fetch_assoc()) {
        $connectedUser[] = $row;
    }

    $response['connectedUser'] = $connectedUser;
    $stmt->close();
} else {
    $response['error'] = "Failed to prepare the SQL statement";
}

echo json_encode($response);
$conn->close();
