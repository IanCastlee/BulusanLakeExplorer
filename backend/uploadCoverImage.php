<?php
include("./header.php");
include("./conn.php");

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;

// Function to generate a unique filename
function generateUniqueFilename($file)
{
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    return $basename . '.' . $extension;
}

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $response = ['success' => false, 'message' => ''];

    // Check if file was uploaded without errors
    if (!empty($_FILES['image']['name'])) {
        $file_name = generateUniqueFilename($_FILES['image']);
        $tempname = $_FILES['image']['tmp_name'];
        $folder = 'uploads/' . $file_name;

        // SQL query to update the profile picture
        $sql = "UPDATE users SET coverPic = ? WHERE user_id = ?";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param('si', $file_name, $currentUserId);

            if ($stmt->execute()) {
                if (move_uploaded_file($tempname, $folder)) {
                    $response['success'] = true;
                    $response['message'] = 'Cover picture updated successfully';
                } else {
                    $response['message'] = 'Error moving uploaded file';
                }
            } else {
                $response['message'] = 'Failed to execute statement: ' . $stmt->error;
            }

            $stmt->close();
        } else {
            $response['message'] = 'Failed to prepare statement: ' . $conn->error;
        }
    } else {
        $response['message'] = 'No file uploaded';
    }

    echo json_encode($response);
}
