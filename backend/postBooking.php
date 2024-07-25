<?php

include("./header.php");


header('Content-Type: application/json');

include("conn.php");

$bookingData  = json_decode(file_get_contents('php://input'), true);

$actId = isset($bookingData['actId']) ? $bookingData['actId'] : "";
$userId = isset($bookingData['userId']) ? $bookingData['userId'] : "";
$participant = isset($bookingData['participant']) ? $bookingData['participant'] : "";
$dateBook = isset($bookingData['dateBook']) ? $bookingData['dateBook'] : "";
$totalPrice = isset($bookingData['totalPrice']) ? $bookingData['totalPrice'] : "";


if ($userId && $actId && $participant && $dateBook && $totalPrice) {
    $addBooking = mysqli_query($conn, "INSERT INTO booking (act_id, user_id, no_participant, booked_date, total_price,status, createdAt)VALUES('$actId', '$userId', '$participant', '$dateBook', '$totalPrice','pending', NOW())");

    if ($addBooking) {
        echo json_encode(['success' => true, 'message' => 'Succesfully booked']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error in inserting data']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Error in data handling']);
}
