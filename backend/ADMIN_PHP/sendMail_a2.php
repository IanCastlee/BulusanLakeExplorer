<?php
include("../header.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

$response = ['success' => false, 'message' => ""];

// Fetch and sanitize POST data
$content2 = isset($_POST['content2']) ? $_POST['content2'] : null;
$title2 = isset($_POST['title2']) ? $_POST['title2'] : null;
$email2 = isset($_POST['email2']) ? $_POST['email2'] : null;
$act_id2 = isset($_POST['act_id2']) ? $_POST['act_id2'] : null;

$website_url = "https://bulusanlakeexplorer.kesug.com/act-info/{$act_id2}";

// Button for email content
$button = "<a href='{$website_url}' style='
        display: inline-block;
        padding: 10px 20px;
        font-size: 12px;
        color: white;
        background-color: #28a745;
        text-decoration: none;
        border-radius: 5px;
    '>Share Feedback</a>";

// Proceed if email is provided and valid
if ($email2) {
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'ml99997955@gmail.com'; // Your Gmail address
        $mail->Password   = 'sers hwlz crfu fzas';  // App password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('ml99997955@gmail.com', 'BulusanLakeExplorer');
        $mail->addAddress($email2);  // Add recipient email

        // Content
        $mail->isHTML(true);
        $mail->Subject = $title2;
        $mail->Body    = $content2 . '<br><br>' . $button; // Add the button to the email body

        // Send the email
        if ($mail->send()) {
            $response['success'] = true;
            $response['message'] = 'Email successfully sent';
        } else {
            $response['message'] = 'Failed to send email';
        }
    } catch (Exception $e) {
        // Log the detailed error message for easier debugging
        $response['message'] = "Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    $response['message'] = 'No email address provided or invalid email';
}

// Return the JSON response
header('Content-Type: application/json');
echo json_encode($response);
