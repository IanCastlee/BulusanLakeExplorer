<?php
include("../header.php");
include("../conn.php");


if ($stmt =  $conn->prepare("SELECT b.*, u.fullname,u.address, a.name, a.price, cr.reason FROM booking AS b JOIN users AS u ON b.user_id = u.user_id JOIN activities AS a ON b.act_id = a.act_id JOIN cancelled_reservation AS  cr ON cr.booked_id =  b.booked_id  WHERE b.status = 'cancelled' ORDER BY b.booked_id ASC")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $pendingBook = [];


    while ($row = $result->fetch_assoc()) {
        $pendingBook[] = $row;
    }

    echo json_encode($pendingBook);
    $stmt->close();
} else {
    echo json_encode(['error' => "Failed to fetch data"]);
}

$conn->close();
