<?php

include("./header.php");

header('Content-Type: application/json');
include("conn.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$bookingData  = json_decode(file_get_contents('php://input'), true);

$userId = $bookingData['userId'] ?? null;
$booked_date = $bookingData['booked_date'] ?? null;
$updated_date = $bookingData['updated_date'] ?? null;

$content_ = $bookingData['content_'] ?? null;


$website_url = "https://bulusanlakeexplorer.kesug.com";

// Email content with a button

$content = "
    <span style='font-size: 14px; font-weight: 500'>{$content_}</span>
    <p style='font-size: 10px; margin-top: 10px' >Click the button below to visit our website and view your reservation:</p>
    <a href='{$website_url}' style='
        display: inline-block;
        padding: 10px 20px;
        alight-items: end;
        font-size: 12px;
        color: white;
        background-color: #28a745;
        text-decoration: none;
        border-radius: 5px;
    '>Visit Website</a>
";
$title_ = $bookingData['title_'] ?? null;

$response = ['success' => false, 'message' => 'An error occurred'];

if ($booked_date && $updated_date) {

    $stmt_getEmail = $conn->prepare("SELECT email FROM users  WHERE user_id != '$userId' AND status  !=  2");
    $stmt_getEmail->execute();
    $stmt_getEmail->bind_result($email);

    $emails = [];
    while ($stmt_getEmail->fetch()) {
        $emails[] = $email;
    }

    if (!empty($emails)) {
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

            // Set custom sender email and name
            $mail->setFrom('ml99997955@gmail.com', 'BulusanLakeExplorer');

            // Content
            $mail->isHTML(true);
            $mail->Subject = $title_;
            $mail->Body    = $content;

            // Add recipients and send emails
            foreach ($emails as $recipient) {
                $mail->clearAddresses();
                $mail->addAddress($recipient);
                $mail->send();
            }

            $response['success'] = true;
            $response['message'] = 'Emails successfully sent';
            $response['emails'] = $emails;
        } catch (Exception $e) {
            $response['message'] = "Mailer Error: {$mail->ErrorInfo}";
        }
    } else {
        $response['message'] = 'No emails found';
    }
} else {
    $response['message'] = 'Invalid booking or updated date';
}

echo json_encode($response);
