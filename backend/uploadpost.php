<?php
include("./header.php");
include("./conn.php");

header('Content-Type: application/json');

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;

$response = ["success" => false, "errors" => []];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $caption = $_POST['caption'];
    $privacy = $_POST['privacy'];
    $uploads_dir = 'uploads/';
    $uploaded_files = [];
    $createdAt = date("Y-m-d H:i:s");

    // Allowed file types (Optional, adjust as needed)
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    // Check if any files were uploaded
    if (isset($_FILES['images']) && count($_FILES['images']['name']) > 0) {
        $has_files = false;

        foreach ($_FILES['images']['name'] as $key => $name) {
            if ($name != "") {
                $has_files = true; // At least one file is present

                $tmp_name = $_FILES['images']['tmp_name'][$key];
                $file_ext = pathinfo($name, PATHINFO_EXTENSION);

                // Validate file type
                if (!in_array($file_ext, $allowed_types)) {
                    $response['errors'][] = "File type not allowed: " . $name;
                    continue;
                }

                $upload_file = $uploads_dir . basename($name);

                if (move_uploaded_file($tmp_name, $upload_file)) {
                    $uploaded_files[] = basename($name); // Store only the filename
                } else {
                    $response['errors'][] = "Failed to upload: " . $name;
                }
            }
        }

        if (!$has_files) {
            $response['errors'][] = "No files uploaded. Please upload at least one image.";
        }
    } else {
        $response['errors'][] = "No files uploaded. Please upload at least one image.";
    }

    if (empty($response['errors'])) {
        // Insert the post
        $stmt = $conn->prepare("INSERT INTO posts (user_id, caption, status, createdAt) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $currentUserId, $caption, $privacy, $createdAt);
        if ($stmt->execute()) {
            $post_id = $stmt->insert_id; // Get the generated post_id
            $stmt->close();

            // Insert each image with the post_id
            $stmt = $conn->prepare("INSERT INTO images (post_id, image_path) VALUES (?, ?)");
            foreach ($uploaded_files as $file_name) {
                $stmt->bind_param("is", $post_id, $file_name);
                if (!$stmt->execute()) {
                    $response['errors'][] = "Failed to save image: " . $file_name;
                }
            }
            $stmt->close();
            $response["success"] = true;
        } else {
            $response['errors'][] = "Failed to save post information.";
        }
    }
}

echo json_encode($response);
