<?php

include("./header.php");
include("./conn.php");


$response = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $bio_id = isset($_POST['bio_id']) ? $_POST['bio_id'] : '';

    $deleteData = mysqli_query($conn, "DELETE FROM bio WHERE bio_id = '$bio_id'");
    if ($deleteData) {
        $response['success'] = true;
    } else {
        $response['error'] = "Failed to delete data" . mysqli_error($conn);
    }
} else {
    $response['error'] = "Failed to get data id ";
}

echo json_encode($response);
$conn->close();
