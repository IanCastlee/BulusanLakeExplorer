<?php

include("./header.php");


include("./conn.php");

$uid  = isset($_GET['id']) ? $_GET['id'] : 0;
$status = "pending";


if ($stmt =  $conn->prepare("SELECT b.*, a.name  FROM booking AS b JOIN activities AS a ON b.act_id = a.act_id WHERE user_id = ? AND status = ?")) {
    $stmt->bind_param('is', $uid, $status);
    $stmt->execute();
    $result = $stmt->get_result();
    $booking = [];

    while ($row = $result->fetch_assoc()) {
        $booking[] = $row;
    }
    echo json_encode($booking);

    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to prepare the SQL statement"]);
}

$conn->close();
