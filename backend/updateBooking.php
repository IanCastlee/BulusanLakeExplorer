<?php

include("./header.php");

header('Content-Type: application/json');
include("conn.php");

$bookingData  = json_decode(file_get_contents('php://input'), true);

$actId = $bookingData['actId'] ?? null;
$userId = $bookingData['userId'] ?? null;
$participant = $bookingData['participant'] ?? null;
$dateBook = isset($bookingData['dateBook']) ? date('Y-m-d', strtotime($bookingData['dateBook'])) : null;
$totalPrice = $bookingData['totalPrice'] ?? null;
$booked_id = $bookingData['booked_id'] ?? null;

$booked_date = $bookingData['booked_date'] ?? null;
$updated_date = $bookingData['updated_date'] ?? null;
$readable_date = $booked_date ? date("F j, Y", strtotime($booked_date)) : null;

$act_name = $bookingData['act_name'] ?? null;
$createdAt = date("Y-m-d H:i:s");
$content = "A new slot for {$act_name} is available on {$readable_date}.";
$status = "canceled";
$title = "Reservation Slot";

$response = ['success' => false, 'message' => 'Error in data handling'];

try {
    if ($userId && $actId && $participant && $dateBook && $totalPrice) {
        $stmt_update = $conn->prepare("UPDATE booking SET no_participant = ?, booked_date = ?, total_price = ? WHERE booked_id = ?");
        $stmt_update->bind_param("isdi", $participant, $dateBook, $totalPrice, $booked_id);

        if ($stmt_update->execute()) {
            $response['success'] = true;
            $response['message'] = 'Reservation successfully updated';

            if ($booked_date !== $updated_date) {
                $stmt_notif = $conn->prepare("INSERT INTO notifications (sender, title, content, createdAt) VALUES (?,?, ?,?) ");
                $stmt_notif->bind_param('isss', $userId, $title, $content, $createdAt);

                if ($stmt_notif->execute()) {

                    $response['success'] = true;
                } else {
                    $response['message'] = 'Failed to insert notification';
                }
            }
        } else {
            $response['message'] = 'Error in updating reservation';
        }
    }
} catch (Exception $e) {
    $response['message'] = "An error occurred: " . $e->getMessage();
}

echo json_encode($response);
