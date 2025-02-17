<?php
include("../header.php");
include("../conn.php");


$response = ['success' => false, 'error' => "", 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $user_id = $_POST['user_id'] ? $_POST['user_id'] : null;
    $booking_id = $_POST['booking_id'] ? $_POST['booking_id'] : null;
    $email = $_POST['email'] ? $_POST['email'] : null;
    $date = $_POST['date'] ? $_POST['date'] : null;
    $time = $_POST['time'] ? $_POST['time'] : null;
    $name = $_POST['name'] ? $_POST['name'] : null;
    $reason = $_POST['reason'] ? $_POST['reason'] : null;



    $reservation_status = "declined";

    $content = "We regret to inform you that your reservation for $name on $date at $time has been declined due to the following reason: ($reason).";
    $title = "Declined Reservation";
    $currentDate = date('Y-m-d');
    $status = "unclicked";

    if ($user_id && $booking_id && $email && $date && $time && $name && $reason) {

        $stmt_update = $conn->prepare("UPDATE booking set status = ? WHERE booked_id = ?");
        $stmt_update->bind_param("si", $reservation_status, $booking_id);

        if ($stmt_update->execute()) {
            $stmt_insert = $conn->prepare("INSERT INTO decline_reservation (reservation_id, reason)VALUES(?,?)");
            $stmt_insert->bind_param("is", $booking_id, $reason);

            if ($stmt_insert->execute()) {

                $stmt_insert_notif = $conn->prepare("INSERT INTO notifications (reciever, title, content, createdAT, status)VALUES(?,?,?,?,?)");
                $stmt_insert_notif->bind_param("issss", $user_id, $title, $content, $currentDate, $status);

                if ($stmt_insert_notif->execute()) {
                    $response = ['success' => true, 'message' => "Notification succesfully added"];
                } else {
                    $response = ['success' => false, 'error' => "Can't Insert Data"];
                }
            }
        } else {
            $response = ['success' => false, 'error' => "Can't Update the data"];
        }
    } else {
        $response = ['success' => false, 'error' => "Data is empty"];
    }
} else {
    $response = ['success' => false, 'error' => "Can't connect to frontend"];
}
echo json_encode($response);
