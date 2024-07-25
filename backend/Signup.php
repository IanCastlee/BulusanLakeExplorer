<?php

include("./header.php");



header('Content-Type: application/json');

// Database credentials
include("./conn.php");

// Retrieve and decode the JSON payload
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['username'], $input['fullname'], $input['address'], $input['email'], $input['password'])) {
    $username = $conn->real_escape_string($input['username']);
    $fullname = $conn->real_escape_string($input['fullname']);
    $address = $conn->real_escape_string($input['address']);
    $email = $conn->real_escape_string($input['email']);
    $password = password_hash($input['password'], PASSWORD_BCRYPT);

    // Check if the username or email already exists
    $sql = "SELECT * FROM users WHERE  email='$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username or email already taken']);
    } else {
        // Insert the new user into the database
        $sql = "INSERT INTO users (username, fullname, address, email, password, acc_type) VALUES ('$username', '$fullname', '$address', '$email', '$password', 'user_000')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Registration successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
