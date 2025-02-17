<?php
include("./header.php");
include("./conn.php");

$response = ['success' => false, 'message' => "", 'error' => ""];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $act_id = $_POST['act_id'];
    $quantity = (int)$_POST['quantity']; // Ensure quantity is treated as an integer
    $booked_date = $_POST['booked_date'];

    if ($act_id && $quantity && $booked_date) {
        // Prepare the SQL statement to count participants per time slot from the booked_time table
        $stmt_check = $conn->prepare(
            "SELECT bt.booked_time, SUM(bt.participant) as total_participants 
            FROM booked_time AS bt 
            JOIN booking AS b ON bt.booking_id = b.booked_id 
            WHERE b.act_id = ? AND b.booked_date = ? AND b.status IN ('pending', 'reserved')
            GROUP BY bt.booked_time"
        );

        // Bind parameters: act_id and booked_date
        $stmt_check->bind_param("ss", $act_id, $booked_date);

        // Execute the statement
        if ($stmt_check->execute()) {
            $result = $stmt_check->get_result();
            $bookingsEqual = [];
            $bookingsLess = [];

            while ($row = $result->fetch_assoc()) {
                $totalParticipants = (int)$row['total_participants'];
                $bookedTime = $row['booked_time'];

                // Check if total_participants is equal to quantity
                if ($totalParticipants == $quantity) {
                    $bookingsEqual[] = $bookedTime;
                }
                // Check if total_participants is less than quantity
                if ($totalParticipants < $quantity) {
                    $neededParticipants = $quantity - $totalParticipants; // Calculate the missing participants
                    $bookingsLess[] = ['time' => $bookedTime, 'needed' => $neededParticipants];
                }
            }

            if (!empty($bookingsEqual) || !empty($bookingsLess)) {
                $response['success'] = true;
                $response['message'] = "Bookings found.";
                $response['data'] = $bookingsEqual; // Bookings with exactly the quantity
                $response['data2'] = $bookingsLess; // Bookings with less than the quantity
            } else {
                $response['message'] = "No bookings found with the specified criteria.";
            }
        } else {
            $response['error'] = "Database query error: " . $stmt_check->error;
        }

        $stmt_check->close();
    } else {
        $response['error'] = "Activity ID, quantity, or booked date is empty.";
    }
} else {
    $response['error'] = "Unable to connect to the frontend.";
}

// Output the response in JSON format
header('Content-Type: application/json');
echo json_encode($response);
