<?php
include("../header.php");
include("../conn.php");

$response = ['success' => false, 'error' => []];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $intro = isset($_POST['intro']) ? $_POST['intro'] : null;
    $defination = isset($_POST['defination']) ? $_POST['defination'] : null;
    $reservationProcess = isset($_POST['reservationProcess']) ? $_POST['reservationProcess'] : null;
    $payment = isset($_POST['payment']) ? $_POST['payment'] : null;
    $cancellation = isset($_POST['cancellation']) ? $_POST['cancellation'] : null;
    $userResponsibilities = isset($_POST['userResponsibilities']) ? $_POST['userResponsibilities'] : null;

    if ($intro && $defination && $reservationProcess && $payment && $cancellation && $userResponsibilities) {
        $stmt = $conn->prepare("UPDATE termsandcondations SET intro = ?, defination = ?, reservationProcess = ?, payment = ?, cancellation = ?, userResponsibilities = ?");

        // Bind parameters
        $stmt->bind_param("ssssss", $intro, $defination, $reservationProcess, $payment, $cancellation, $userResponsibilities);

        // Execute the statement
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['error'][] = "Failed to update data: " . $stmt->error;
        }

        $stmt->close();
    } else {
        $response['error'][] = "Some field is empty";
    }
} else {
    $response['error'][] = "Invalid request method";
}

echo json_encode($response);
$conn->close();
