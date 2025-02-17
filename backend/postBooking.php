<?php

include("./header.php");
header('Content-Type: application/json');
include("conn.php");


$response = ['success' => false, 'error' => "", 'message' => ""];

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    // Use `$_POST` for non-file inputs and `$_FILES` for file input
    $actId = isset($_POST['actId']) ? $_POST['actId'] : null;
    $name = isset($_POST['name']) ? $_POST['name'] : null;
    $userId = isset($_POST['userId']) ? $_POST['userId'] : null;
    $participant = isset($_POST['participant']) ? $_POST['participant'] : null;
    $resfee = isset($_POST['resfee']) ? $_POST['resfee'] : null;
    $dateBook = isset($_POST['dateBook']) ? $_POST['dateBook'] : null;
    $timeBooked = isset($_POST['timeBooked']) ? json_decode($_POST['timeBooked'], true) : null;
    $totalPrice = isset($_POST['totalPrice']) ? $_POST['totalPrice'] : null;
    $participantCount = isset($_POST['participantCount']) ? json_decode($_POST['participantCount'], true) : null;


    $dateBook = date('Y-m-d', strtotime($dateBook));
    $createdAt = date("Y-m-d h:i:s P");

    // Validate that the required data is present
    if ($userId && $actId && $participant && $dateBook && $totalPrice && $resfee && $timeBooked && $participantCount) {
        // Insert into the booking table
        $addBooking = mysqli_query($conn, "INSERT INTO booking (act_id, user_id, no_participant, booked_date, total_price, reservation_fee, status, createdAt) VALUES ('$actId', '$userId', '$participant', '$dateBook', '$totalPrice', '$resfee', 'reserved', '$createdAt')");

        if ($addBooking) {
            // Get the last inserted booking_id
            $bookingId = mysqli_insert_id($conn);

            // Loop through timeBooked and participantCount arrays
            for ($i = 0; $i < count($timeBooked); $i++) {
                $time = mysqli_real_escape_string($conn, $timeBooked[$i]);
                $count = (int)$participantCount[$i]; // Ensure participant count is an integer
                // Insert into booked_time table
                $addBookedTime = mysqli_query($conn, "INSERT INTO booked_time (name, act_id, booking_id, booked_time, booked_date, participant) VALUES ('$name','$actId','$bookingId', '$time','$dateBook', '$count')");

                if (!$addBookedTime) {
                    echo json_encode(['success' => false, 'message' => 'Error in inserting booked time']);
                    exit; // Exit on error to prevent further processing
                }
            }

            $response = ['success' => true, 'message' => "Succesfully booked"];
        } else {
            $response['success'] = false;
            $response['message'] = 'Error in inserting booking data';
        }
    } else {
        $response['success'] = false;
        $response['message'] = 'Error in data handling';
    }
} else {
    $response = ['success' => false, 'error' => "Cant connect to client"];
}

echo json_encode($response);
$conn->close();
