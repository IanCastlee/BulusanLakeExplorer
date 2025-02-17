<?php
include("./header.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './vendor/autoload.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ""];

$email = isset($_POST['email']) ? trim($_POST['email']) : null;
$title = isset($_POST['title']) ? trim($_POST['title']) : null;
$content = isset($_POST['content']) ? trim($_POST['content']) : null;
$userID = isset($_POST['userId']) ? trim($_POST['userId']) : null; // Ensure casing matches `userId`

if ($email && $title && $content && $userID) {
    $website_url = "https://bulusanlakeexplorer.kesug.com/mybooking/{$userID}";

    // Button for email content
    $button = "<a href='{$website_url}' style='
            display: inline-block;
            padding: 10px 20px;
            font-size: 12px;
            color: white;
            background-color: #28a745;
            text-decoration: none;
            border-radius: 5px;
        '>Go to Reservation</a>";

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'ml99997955@gmail.com'; // Your Gmail address
        $mail->Password   = 'sers hwlz crfu fzas'; // App password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('ml99997955@gmail.com', 'BulusanLakeExplorer');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = $title;
        $mail->Body    = $content . '<br><br>' . $button;

        if ($mail->send()) {
            $response['success'] = true;
            $response['message'] = 'Email successfully sent';
        } else {
            $response['message'] = 'Failed to send email';
        }
    } catch (Exception $e) {
        $response['message'] = "Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    error_log("Missing data: email={$email}, title={$title}, content={$content}, userID={$userID}");
    $response['message'] = 'Some data is empty';
}

echo json_encode($response);
