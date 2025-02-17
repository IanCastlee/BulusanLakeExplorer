<?php
include("./header.php");
include("./conn.php");

$response = [];

$bio_id = isset($_GET['bio_id']) ? $_GET['bio_id'] : null;

$response['id'] = $bio_id;

if (!$bio_id) {
    $response['error'] = "bio_id is required";
    echo json_encode($response);
    exit();
}

if ($stmt = $conn->prepare("SELECT * FROM bio WHERE bio_id = ?")) {
    $stmt->bind_param("i", $bio_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($biodetails = $result->fetch_assoc()) {
        $response['biodetails'] = $biodetails;
    } else {
        $response['error'] = "No details found for the given bio_id";
    }

    $stmt->close();
} else {
    $response['error'] = "Error in preparing statement: " . $conn->error;
}

echo json_encode($response);
$conn->close();
