<?php
include("./header.php");
include("./conn.php");

$booked_id = isset($_GET['id']) ? $_GET['id'] : null;

if ($booked_id) {
    // Get reservation details
    $getReservedDetails = mysqli_query($conn, "SELECT b.*, a.name, a.act_id, u.user_id, u.fullname 
        FROM booking AS b 
        JOIN activities AS a ON b.act_id = a.act_id 
        JOIN users AS u ON b.user_id = u.user_id 
        WHERE b.booked_id = '$booked_id'");

    $reservationDetails = mysqli_fetch_assoc($getReservedDetails);

    if ($reservationDetails) {
        // Get booked times and participants for the reservation
        $getBookedTimes = mysqli_query($conn, "SELECT bt.booked_time, bt.participant 
            FROM booked_time AS bt 
            WHERE bt.booking_id = '$booked_id'");

        $bookedTimes = [];
        while ($row = mysqli_fetch_assoc($getBookedTimes)) {
            $bookedTimes[] = $row['booked_time'] . ' - slot : ' . $row['participant'];
        }

        // Add booked_times to reservation details as a formatted array
        $reservationDetails['booked_times'] = $bookedTimes;

        // Prepare the response
        $response['reservationDetails'] = $reservationDetails;
    } else {
        $response = array("message" => "Data not found.");
    }

    // Output the response as JSON
    echo json_encode($response);
} else {
    echo json_encode(array("message" => "Invalid booking ID."));
}

$conn->close();
