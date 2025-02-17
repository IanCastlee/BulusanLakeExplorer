<?php

include("./header.php");
include("./conn.php");

session_start();
$userid = isset($_SESSION['userid']) ? $_SESSION['userid'] : null;

if ($stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ?")) {
    $stmt->bind_param('i', $userid);
    $stmt->execute();
    $result =  $stmt->get_result();

    if ($result->num_rows > 0) {
        $userInfo = $result->fetch_assoc();
        echo json_encode([
            'userInfo' => $userInfo,
            'userid' => $userid

        ]);
    } else {
        echo json_encode(["error" => "User not found"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to prepare the SQL statement"]);
}

$conn->close();
