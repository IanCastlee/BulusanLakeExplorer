<?php
include("./header.php");
include("./conn.php");

// Function to generate a unique filename
function generateUniqueFilename($file)
{
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    return $basename . '.' . $extension;
}

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;
$response = ["success" => false, "errors" => []];

$response = ['success' => false, 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = $_POST['fullname'];
    $username = $_POST['username'];
    $address = $_POST['address'];


    if (!empty($_FILES['image']['name'])) {
        $file_name = generateUniqueFilename($_FILES['image']);
        $tempname = $_FILES['image']['tmp_name'];
        $folder = 'uploads/' . $file_name;

        // SQL query to update the profile picture
        $stmt = $conn->prepare("UPDATE users SET fullname = ?, username = ?, address = ?, valid_id_image = ? WHERE user_id = ?");
        $stmt->bind_param("ssssi", $fullname, $username, $address, $file_name, $currentUserId);
        if ($stmt->execute()) {
            if (move_uploaded_file($tempname, $folder)) {
                $response['success'] = true;
                $response['message'] = 'Profile picture updated successfully';
            } else {
                $response['message'] = 'Error moving uploaded file';
            }
        } else {
            $response['message'] = 'Failed to execute statement: ' . $stmt->error;
        }

        $stmt->close();
    } else {
        $stmt = $conn->prepare("UPDATE users SET fullname = ?, username = ?, address = ? WHERE user_id = ?");
        if ($stmt) {
            $stmt->bind_param("sssi", $fullname, $username, $address, $currentUserId);
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['msg'] = 'Succesfully updated';
            } else {
                $response['error'] = "Failed to update announcement: " . $stmt->error;
            }
            $stmt->close();
        } else {
            $response['error'] = "Failed to prepare statement: " . $conn->error;
        }
    }
} else {
    $response['error'] = "Invalid request method";
}

echo json_encode($response);

$conn->close();
