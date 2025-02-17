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
    $type = $_POST['type'];
    $name = $_POST['name'];
    $sname = $_POST['sname'];
    $about = $_POST['about'];
    $characteristic = $_POST['characteristic'];

    $response = ['success' => false, 'message' => ''];

    // Check if file was uploaded without errors
    if (!empty($_FILES['image']['name'])) {
        $file_name = generateUniqueFilename($_FILES['image']);
        $tempname = $_FILES['image']['tmp_name'];
        //$folder = 'biodiversity_imgs/' . $file_name;
        $folder = 'bioimages/' . $file_name;


        $sql = "INSERT INTO bio (type, name, sname, about, characteristic, image) VALUES ('$type','$name', '$sname', '$about','$characteristic','$file_name')";


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
