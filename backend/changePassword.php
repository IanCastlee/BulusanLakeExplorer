<?php
include("./header.php");
include("./conn.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$verify_token = rand(1000, 9999);

$response = ['error' => []];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $v_status = 0;

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {

        $row = $result->fetch_assoc();
        $email_db = $row['email'];

        $stmt_update = $conn->prepare("UPDATE users SET password = ?, verify_token = ?, verify_status = ? WHERE email = ?");
        $stmt_update->bind_param('ssis', $password, $verify_token, $v_status, $email);
        if ($stmt_update->execute()) {

            $mail = new PHPMailer(true);

            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com'; // Gmail SMTP server
                $mail->SMTPAuth   = true;
                $mail->Username   = 'ml99997955@gmail.com'; // Your Gmail address
                $mail->Password   = 'sers hwlz crfu fzas'; // Your Gmail App Password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Use TLS encryption
                $mail->Port       = 587; // TCP port to connect to

                // Recipients
                $mail->setFrom('ml99997955@gmail.com', 'BulusanLakeExplorer'); // Your Gmail address
                $mail->addAddress($email); // Add recipient email address

                // Content
                $mail->isHTML(true);
                $mail->Subject = 'Verify your email address';
                $mail->Body    = 'Use the code to verify your accoun, ' . 'heres your verification code: ' . $verify_token;
                $mail->AltBody = 'Please copy and paste the following link into your browser to verify your email address: http://localhost/BULUSANLAKE_EXPLORER/backend/verify.php?token=' . urlencode($verify_token) . "\n\n"
                    . 'Your verification code: ' . $verify_token;

                $mail->send();
                echo json_encode(['success' => true, 'message' => 'Password changed successfully. Check your email to verify.']);
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
            }
            $response['message'] = 'Check your email to verify';
        }
    } else {
        echo json_encode(['success' => false, 'messageErr' => 'Email not exist in database']);
    }
} else {
    $response['error'][] = "Request failed";
}
