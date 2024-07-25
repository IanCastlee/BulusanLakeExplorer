<?php
// header('Access-Control-Allow-Origin: http://blsnadmin.free.nf/');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

include("./conn.php");

if ($stmt =  $conn->prepare("SELECT b.*, u.fullname,u.address, a.name, a.price FROM booking AS b JOIN users AS u ON b.user_id = u.user_id JOIN activities AS a ON b.act_id = a.act_id WHERE b.status = 'pending' ORDER BY b.booked_id ASC")) {
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
