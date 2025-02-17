<?php
include("../header.php");
include("../conn.php");

// Function para magenerate ng unique filename
function generateUniqueFilename($file)
{
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    return $basename . '.' . $extension;
}


// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $price = $_POST['price'];
    $pricing_details = $_POST['pricing_details'];
    $discount = $_POST['discount'];
    $duration = $_POST['duration'];
    $maxreservation = $_POST['maxreservation'];
    $quantity = $_POST['quantity'];
    $tagline = $_POST['tagline'];
    $note = $_POST['note'];
    $description = $_POST['description'];
    $noteReservation = $_POST['noteReservation'];
    $resfee = $_POST['resfee'];
    $status = 'active';

    $response = ['success' => false, 'message' => ''];

    // Check if file was uploaded without errors
    if (!empty($_FILES['image']['name'])) {
        $file_name = generateUniqueFilename($_FILES['image']);
        $tempname = $_FILES['image']['tmp_name'];
        $folder = 'uploads/' . $file_name;


        $sql = "INSERT INTO activities (name, price,pricing_details, discount, duration, maxreservation,quantity, tagline, image, description,important_notice, note, status, reservation_fee) VALUES ('$name', '$price','$pricing_details', '$discount','$duration', '$maxreservation','$quantity', '$tagline', '$file_name', '$description','$note','$noteReservation', '$status', '$resfee')";

        if (move_uploaded_file($tempname, $folder)) {
            if (mysqli_query($conn, $sql)) {
                $response['success'] = true;
                $response['message'] = 'Inserted successfully';
            } else {
                $response['message'] = 'Database error: ' . mysqli_error($conn);
            }
        } else {
            $response['message'] = 'Error moving uploaded file';
        }
    } else {
        $response['message'] = 'No file uploaded';
    }

    echo json_encode($response);
}
