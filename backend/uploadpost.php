<?php
include("./header.php");
include("./conn.php");

header('Content-Type: application/json');

session_start();
$currentUserId = isset($_SESSION['userid']) ? $_SESSION['userid'] : 0;

$response = ["success" => false, "errors" => []];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $caption = $_POST['caption'];
    $hashtag = $_POST['hashtag'];
    $privacy = $_POST['privacy'];
    $uploads_dir = 'uploads/';
    $uploaded_files = [];
    $createdAt = date("Y-m-d H:i:s");

    // Allowed MIME types for all images
    $allowed_mime_types = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/avif',
        'image/bmp',
        'image/tiff',
        'image/x-icon',
        'image/vnd.microsoft.icon',
        'image/svg+xml'
    ];

    // Check if any files were uploaded
    if (isset($_FILES['images']) && count($_FILES['images']['name']) > 0) {
        $has_files = false;

        foreach ($_FILES['images']['name'] as $key => $name) {
            if ($name != "") {
                $has_files = true; // At least one file is present

                $tmp_name = $_FILES['images']['tmp_name'][$key];

                // Validate MIME type
                $mime_type = mime_content_type($tmp_name);
                if (!in_array($mime_type, $allowed_mime_types)) {
                    $response['errors'][] = "The file '$name' is not a valid image. Allowed types are JPEG, PNG, GIF, etc.";
                    continue; // Skip to the next file
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
        // No images uploaded case
        $response['errors'][] = "No files uploaded. Please upload at least one image.";
    }

    // If no errors (i.e., images uploaded successfully)
    if (empty($response['errors'])) {
        // Insert the post
        $stmt = $conn->prepare("INSERT INTO posts (user_id, caption, status, createdAt, hashtag) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $currentUserId, $caption, $privacy, $createdAt, $hashtag);
        if ($stmt->execute()) {
            $post_id = $stmt->insert_id; // Get the generated post_id
            $stmt->close();

            // Insert each image with the post_id
            $stmt = $conn->prepare("INSERT INTO images (user_id, post_id, image_path) VALUES (?, ?, ?)");
            foreach ($uploaded_files as $file_name) {
                $stmt->bind_param("iis", $currentUserId, $post_id, $file_name);
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
