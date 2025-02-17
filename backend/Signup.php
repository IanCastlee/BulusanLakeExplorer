<?php

include("./header.php");

header('Content-Type: application/json');
include("./conn.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$verify_token = rand(1000, 9999);

// Retrieve and decode the JSON payload
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['username'], $input['fullname'], $input['address'], $input['email'], $input['password'])) {
    $username = $conn->real_escape_string($input['username']);
    $fullname = $conn->real_escape_string($input['fullname']);
    $address = $conn->real_escape_string($input['address']);
    $email = $conn->real_escape_string($input['email']);
    $password = password_hash($input['password'], PASSWORD_BCRYPT);

    // Check if the email already exists
    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'messageErr' => 'Email already taken']);
    } else {
        // Insert the new user into the database
        $sql = "INSERT INTO users (username, fullname, address, email, password, acc_type, verify_token) VALUES ('$username', '$fullname', '$address', '$email', '$password', 'user_000', '$verify_token')";

        if ($conn->query($sql) === TRUE) {
            // Send verification email
            $mail = new PHPMailer(true);

            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'ml99997955@gmail.com';
                $mail->Password   = 'sers hwlz crfu fzas';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                // Recipients
                $mail->setFrom('ml99997955@gmail.com', 'BulusanLakeExplorer');
                $mail->addAddress($email);

                // Content
                $mail->isHTML(true);
                $mail->Subject = 'Verify your Email';
                $mail->Body    = 'Use the code to verify your account, ' . 'Your verification code: ' . $verify_token;
                $mail->AltBody = 'Please copy and paste the following link into your browser to verify your email address: http://localhost/BULUSANLAKE_EXPLORER/backend/verify.php?token=' . urlencode($verify_token) . "\n\n"
                    . 'Your verification code: ' . $verify_token;

                $mail->send();
                echo json_encode(['success' => true, 'message' => 'Password changed successfully. Check your email to verify.', 'email' => $email]);
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
