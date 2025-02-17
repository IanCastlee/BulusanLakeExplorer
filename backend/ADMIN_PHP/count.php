<?php
include("../header.php");
include("../conn.php");


// Query the counts
$users = $conn->query("SELECT COUNT(*) as count FROM users WHERE status = 1  AND verify_status = 1 AND acc_type = 'user_000'")->fetch_assoc()['count'];
$activities = $conn->query("SELECT COUNT(*) as count FROM activities WHERE status = 'active'")->fetch_assoc()['count'];
$posts = $conn->query("SELECT COUNT(*) as count FROM images WHERE status = 2")->fetch_assoc()['count'];
$approved = $conn->query("SELECT COUNT(*) as count FROM booking WHERE status = 'reserved'")->fetch_assoc()['count'];
$notans = $conn->query("SELECT COUNT(*) as count FROM chats WHERE notanswered =  0")->fetch_assoc()['count'];


// Send the response as JSON
echo json_encode([
    'users' => $users,
    'activities' => $activities,
    'posts' => $posts,
    'approved' => $approved,
    'notans' => $notans,
]);

$conn->close();
