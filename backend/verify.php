<?php
include("./header.php");
include("./conn.php");

$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $otp = isset($_POST['otp']) ? $_POST['otp'] : '';

    if ($otp) {
        $verify_token = mysqli_query($conn, "SELECT * FROM users WHERE verify_token = '$otp' LIMIT 1");
        $check_rows = mysqli_num_rows($verify_token);

        if ($check_rows > 0) {
            $row = mysqli_fetch_assoc($verify_token);

            if ($row['verify_status'] == 0) {
                $update_query = mysqli_query($conn, "UPDATE users SET verify_status = 1 WHERE verify_token = '$otp'");

                if ($update_query) {
                    $response = ['success' => true, 'message' => "Your account has been successfully verified."];
                } else {
                    $response = ['success' => false, 'message' => "There was an error updating the verification status. Please try again."];
                }
            } else {
                $response = ['success' => true, 'message' => "Your account is already verified."];
            }
        } else {
            $response['message'] = "Invalid token";
        }
    } else {
        $response['message'] = "OTP is empty";
    }
} else {
    $response['message'] = "Invalid request";
}

echo json_encode($response);
$conn->close();
