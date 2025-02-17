<?php
include("../header.php");
include("../conn.php");

function generateUniqueFilename($file)
{
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $uniqueName = uniqid() . '.' . $ext;
    return $uniqueName;
}

$response = ['success' => false, 'message' => ''];




if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'];
    $name = $_POST['name'];
    $sname = $_POST['sname'];
    $about = $_POST['about'];
    $characteristic = $_POST['characteristic'];
    $bio_id = $_POST['bio_id'];

    if (!empty($_FILES['image']['name'])) {
        $filename = generateUniqueFilename($_FILES['image']);
        $tempname = $_FILES['image']['tmp_name'];
        $folder = './bioimages/' . $filename;

        if (move_uploaded_file($tempname, $folder)) {
            $stmt = $conn->prepare("UPDATE bio SET type = ?, name = ?, sname = ?, about = ?, characteristic = ?, image = ? WHERE bio_id = ?");
            $stmt->bind_param("ssssssi", $type, $name, $sname, $about, $characteristic, $filename, $bio_id);

            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = "Updated Successfully";
            } else {
                $response['message'] = 'Error executing update query';
            }
        } else {
            $response['message'] = 'Error moving uploaded file';
        }
    } else {
        $stmt = $conn->prepare("UPDATE bio SET type = ?, name = ?, sname = ?, about = ?, characteristic = ? WHERE bio_id = ?");
        $stmt->bind_param("sssssi", $type, $name, $sname, $about, $characteristic, $bio_id);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Activity updated successfully';
        } else {
            $response['message'] = 'Error executing update query';
        }
    }

    echo json_encode($response);
    $conn->close();
    exit();
} else {
    $response['message'] = "Invalid request method";
    echo json_encode($response);
    $conn->close();
    exit();
}
