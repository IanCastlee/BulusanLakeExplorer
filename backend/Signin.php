<?php

include("./header.php");


header('Content-Type: application/json');


include("./conn.php");

$input = json_decode(file_get_contents('php://input'), true);

$email = isset($input['email']) ? $input['email'] : '';
$password = isset($input['password']) ? $input['password'] : '';

if ($email && $password) {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $password_db = $row['password'];
        if (password_verify($password, $password_db)) {

            session_start();
            $_SESSION['userid'] = $row['user_id'];


            if ($row['acc_type'] == 'admin_111') {
                echo json_encode(['success' => true, 'message' => 'ADMIN TO BOY', 'isAdmin' => true]);
            } else {
                echo json_encode(['success' => true, 'message' => 'Successfully signed in', 'uid' => $_SESSION['userid'], 'isAdmin' => false]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Incorrect password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Email not registered']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
}
