<?php
// header('Access-Control-Allow-Origin: http://blsnadmin.free.nf/');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

include("./conn.php");

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
    $duration = $_POST['duration'];

    $response = ['success' => false, 'message' => ''];

    // Check if file was uploaded without errors
    if (!empty($_FILES['image']['name'])) {
        $file_name = generateUniqueFilename($_FILES['image']);
        $tempname = $_FILES['image']['tmp_name'];
        $folder = 'uploads/' . $file_name;

        // Ensure the upload directory exists
        // if (!is_dir('./uploads')) {
        //     mkdir('./uploads', 0777, true);
        // }

        $sql = "INSERT INTO activities (name, price, duration, image) VALUES ('$name', '$price', '$duration', '$file_name')";

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
