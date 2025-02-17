<?php
require 'vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

// Firebase configuration
$factory = (new Factory)->withServiceAccount('./config/pushnotif-9156a-firebase-adminsdk-4npg9-a39b21ce6d.json');
$messaging = $factory->createMessaging();

// Read the JSON body from the request
$data = json_decode(file_get_contents('php://input'), true);

$userid = $data['userid'];
$token = $data['token'];

// Here you would typically save the token to your database associated with the user
// For example:
$pdo = new PDO('mysql:host=localhost;dbname=your_database', 'username', 'password');
$stmt = $pdo->prepare('INSERT INTO user_tokens (userid, token) VALUES (:userid, :token) ON DUPLICATE KEY UPDATE token = VALUES(token)');
$stmt->execute(['userid' => $userid, 'token' => $token]);

echo json_encode(['success' => true, 'message' => 'Token saved successfully!']);
