<?php
include("./header.php");
include("./conn.php");

$response = ['success' => false, 'message' => "", 'error' => "", 'data' => []];

// Function to adjust the date (subtract one day)
function adjustDate($originalDate)
{
    $date = new DateTime($originalDate);
    $date->modify('-1 day');
    return $date->format('Y-m-d');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act_id = $_POST['act_id'];
    $name = $_POST['name'];
    $maxReservation = (int)$_POST['maxReservation'];

    // Query to get all participants and calculate based on the name
    $query = "SELECT booked_date, SUM(CASE  WHEN name = 'Boating' AND participant = 2 THEN 12 WHEN name = 'Boating' AND participant = 1 THEN 6 WHEN name = 'Balsa' AND participant = 1 THEN 8 ELSE participant END) AS totalParticipants FROM booked_time WHERE act_id = ? GROUP BY booked_date HAVING totalParticipants >= ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $act_id, $maxReservation);
    $stmt->execute();
    $result = $stmt->get_result();

    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $adjustedDate = adjustDate($row['booked_date']);
        $bookings[] = $adjustedDate;
    }

    if (!empty($bookings)) {
        $response['success'] = true;
        $response['data'] = $bookings;
    } else {
        $response['message'] = "No dates exceed the maximum reservation.";
    }

    $stmt->close();
} else {
    $response['error'] = "Invalid request method";
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
