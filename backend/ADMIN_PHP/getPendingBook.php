<?php
include("../header.php");
include("../conn.php");

if ($stmt = $conn->prepare("SELECT b.*, u.user_id, u.fullname, u.address, u.email, u.valid_id_image, u.profilePic, a.name, a.price, MIN(bt.booked_time) AS first_booked_time FROM booking AS b JOIN users AS u ON b.user_id = u.user_id JOIN activities AS a ON b.act_id = a.act_id JOIN booked_time AS bt ON b.booked_id = bt.booking_id WHERE b.status = 'pending' GROUP BY b.booked_id ORDER BY b.booked_id ASC")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $pendingBook = [];

    while ($row = $result->fetch_assoc()) {
        $booked_id = $row['booked_id'];

        // Fetch all booked times and participants for the current booked_id
        $bookedTimesStmt = $conn->prepare("SELECT booked_time, participant FROM booked_time WHERE booking_id = ?");
        $bookedTimesStmt->bind_param("i", $booked_id);
        $bookedTimesStmt->execute();
        $bookedTimesResult = $bookedTimesStmt->get_result();

        $bookedTimes = [];
        while ($timeRow = $bookedTimesResult->fetch_assoc()) {
            $bookedTimes[] = $timeRow['booked_time'] . ' - participant: ' . $timeRow['participant'];
        }

        // Add the booked_times array to the row data
        $row['booked_times'] = $bookedTimes;

        // Add the current booking row to the pendingBook array
        $pendingBook[] = $row;

        $bookedTimesStmt->close();
    }

    echo json_encode($pendingBook);
    $stmt->close();
} else {
    echo json_encode(['error' => "Failed to fetch data"]);
}

$conn->close();
