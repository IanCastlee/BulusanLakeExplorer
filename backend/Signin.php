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
        $v_status = $row['verify_status'];
        $status = $row['status'];
        if (password_verify($password, $password_db)) {

            if ($status == 0) {
                echo json_encode(['success' => false, 'messageErr' => 'This account may have been deleted or banned due to a violation of system rules.']);
            } else {
                if ($v_status == 0) {
                    echo json_encode(['success' => false, 'messageErr' => 'Email not verified. Please verify your email.']);
                } else {
                    session_start();
                    $_SESSION['userid'] = $row['user_id'];
                    if ($row['acc_type'] == 'admin_111') {
                        echo json_encode(['success' => true, 'message' => 'WELCOME', 'isAdmin' => true]);
                    } else {
                        echo json_encode(['success' => true, 'message' => 'Successfully signed in', 'uid' => $_SESSION['userid'], 'isAdmin' => false]);
                    }
                }
            }
        } else {
            echo json_encode(['success' => false, 'messageErr' => 'Incorrect password']);
        }
    } else {
        echo json_encode(['success' => false, 'messageErr' => 'Email not registered']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
}

$conn->close();
