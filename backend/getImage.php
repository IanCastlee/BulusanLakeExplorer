<?php
include("./header.php");
include("./conn.php");


// Get the image_id from the request
$image_id = isset($_GET['image_id']) ? intval($_GET['image_id']) : 0;

if ($image_id <= 0) {
    echo json_encode(['error' => 'Invalid image ID']);
    exit;
}

// Prepare and execute the SQL query
$sql = "SELECT image_path FROM images WHERE image_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $image_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if the image exists
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['image_path' => $row['image_path']]);
} else {
    echo json_encode(['error' => 'Image not found']);
}

// Close the connection
$stmt->close();
$conn->close();
