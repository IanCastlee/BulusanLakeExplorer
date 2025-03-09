<?php
include("./conn.php");
include("./header.php");

require 'vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

$res = ['success' => false, 'error' => []];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $userid = isset($_POST['userid']) ? $_POST['userid'] : null;
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $body = isset($_POST['body']) ? $_POST['body'] : null;

    $serviceAccount = './pushnotif-9156a-firebase-adminsdk-4npg9-a75d53c0e8.json';
    // Initialize Firebase
    $factory = (new Factory)
        ->withServiceAccount($serviceAccount)
        ->withProjectId('pushnotif-9156a');
    $messaging = $factory->createMessaging();

    $getToken = mysqli_query($conn, "SELECT token FROM notification_token WHERE user_id = '$userid'");
    $row = mysqli_fetch_assoc($getToken);
    $token = $row['token'];


    // Define your message with the provided token
    $url = 'https://blsnxplr.42web.io';
    $message = CloudMessage::withTarget('token', $token)
        ->withNotification(Notification::create($title, $body))
        ->withData([
            'click_action' => $url 
        ]);

    // Send the message
    try {
        $messaging->send($message);
        $res['success'] = true;
        $res['message'] = "Notification sent successfully!";
    } catch (\Kreait\Firebase\Exception\MessagingException $e) {
        $res['error'][] = "Error sending notification: " . $e->getMessage();
    }
} else {
    $res['error'][] = "Invalid request";
}

echo json_encode($res);
