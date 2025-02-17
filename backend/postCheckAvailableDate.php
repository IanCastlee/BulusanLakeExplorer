
<?php
include("./header.php");
include("./conn.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dateChoose = isset($_POST['date']) ? $_POST['date'] : null;
    $maxReserve = isset($_POST['maxReserve']) ? $_POST['maxReserve'] : null;
    $participant = isset($_POST['participant']) ? (int)$_POST['participant'] : 0;

    if ($dateChoose && $maxReserve && $participant) {
        // Check the sum of participants for the selected date
        $checkReserveQuery = mysqli_query($conn, "SELECT SUM(no_participant) as totalParticipants FROM booking WHERE booked_date = '$dateChoose'");
        $reservationData = mysqli_fetch_assoc($checkReserveQuery);
        $currentParticipantCount = (int)$reservationData['totalParticipants'];

        // Calculate the new total if this booking is added
        $newTotalParticipants = $currentParticipantCount + $participant;

        // Check if the new total participants exceed the max reservation limit
        if ($newTotalParticipants > $maxReserve) {
            echo json_encode(['success' => true, 'message' => 'The maximum reservation limit for this date has been reached.']);
            // echo json_encode(['success' => true, 'message' => $newTotalParticipants]);
            exit; // Exit the script after sending the response
        } else {
            echo json_encode(['success' => false, 'message' => 'This date is available for booking.']);
            exit; // Exit the script after sending the response
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        exit; // Exit the script after sending the response
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit; // Exit the script after sending the response
}

$conn->close();
