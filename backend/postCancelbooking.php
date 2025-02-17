<?php
include("./header.php");
include("./conn.php");


$response = ['success' => false, 'error' => "", 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $user_id = $_POST['user_id'] ? $_POST['user_id'] : null;
    $booked_id = $_POST['booked_id'] ? $_POST['booked_id'] : null;
    $email = $_POST['email'] ? $_POST['email'] : null;
    $booked_date = $_POST['booked_date'] ? $_POST['booked_date'] : null;
    $name = $_POST['name'] ? $_POST['name'] : null;
    $reason = $_POST['reason'] ? $_POST['reason'] : null;



    $reservation_status = "cancelled";

    $content = "Your $name booking on $booked_date has been successfully canceled due to ($reason)";
    $title = "Cancelled Reservation";
    $currentDate = date('Y-m-d');
    $status = "unclicked";

    if ($user_id && $booked_id && $email && $booked_date && $name && $reason) {

        $stmt_update = $conn->prepare("UPDATE booking set status = ? WHERE booked_id = ?");
        $stmt_update->bind_param("si", $reservation_status, $booked_id);

        if ($stmt_update->execute()) {
            $stmt_insert = $conn->prepare("INSERT INTO cancelled_reservation (booked_id, reason)VALUES(?,?)");
            $stmt_insert->bind_param("is", $booked_id, $reason);

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
