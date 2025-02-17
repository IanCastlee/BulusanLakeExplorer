<?php

include("./header.php");
include("./conn.php");

$uid  = isset($_GET['id']) ? $_GET['id'] : 0;
$status = "arrived";

// Modify the SQL query to use GROUP_CONCAT() for booked_time
if ($stmt =  $conn->prepare("SELECT b.*, a.name, a.image,u.email, GROUP_CONCAT(bt.booked_time ORDER BY bt.booked_time ASC SEPARATOR ', ') AS booked_times FROM booking AS b JOIN activities AS a ON b.act_id = a.act_id JOIN booked_time AS bt ON bt.booking_id = b.booked_id JOIN users AS u ON u.user_id = b.user_id WHERE b.user_id = ? AND b.status = ? GROUP BY b.booked_id")) {
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
