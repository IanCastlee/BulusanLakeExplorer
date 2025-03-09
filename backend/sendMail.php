<?php
include("./header.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './vendor/autoload.php';

$response = ['success' => false, 'message' => ""];

$email = isset($_POST['email']) ? $_POST['email'] : null;
$title = isset($_POST['title']) ? $_POST['title'] : null;
$content = isset($_POST['content']) ? $_POST['content'] : null;
$userID = isset($_POST['userID']) ? $_POST['userID'] : null;

$user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null;


$website_url = "https://bulusanlakeexplorer.kesug.com/mybooking/";


// Button for email content
$button = "<a href='{$website_url}' style='
            display: inline-block;
            padding: 10px 20px;
            font-size: 12px;
            color: white;
            background-color: #28a745;
            text-decoration: none;
            border-radius: 5px;
        '>Visit Website</a>";

if ($email) {
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
        $mail->Subject = $title;
        $mail->Body    = $content . '<br><br>' . $button; 

        // Send the email
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
    $response['message'] = 'No email address provided';
}

echo json_encode($response);
