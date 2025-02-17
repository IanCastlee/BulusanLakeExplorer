<?php
include("../header.php");
include("../connection.php");

function generateUniqueFilename($file)
{
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    return $basename . '.' . $extension;
}

$response = ['success' => false, 'error' => "", 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $content = isset($_POST['content']) ? $_POST['content'] : null;
    $announcement_id = isset($_POST['announcement_id']) ? $_POST['announcement_id'] : null;
    $createdAt = date("Y-m-d H:i:s");

    // Check if file was uploaded without errors
    if (!empty($_FILES['image']['name'])) {
        $file_name = generateUniqueFilename($_FILES['image']);
        $tempname = $_FILES['image']['tmp_name'];
        $folder = '../images/' . $file_name;

        $stmt_update = $conn->prepare("UPDATE announcement SET title = ?, content = ?, image = ? WHERE announcement_id = ?");
        $stmt_update->bind_param("sssi", $title, $content, $file_name, $announcement_id);

        if ($stmt_update->execute()) {
            if (move_uploaded_file($tempname, $folder)) {
                $response['success'] = true;
                $response['message'] = 'Updated successfully';
            } else {
                $response['message'] = 'Error moving uploaded file';
            }
        } else {
            $response['message'] = 'Database error: ' . $stmt_update->error;
        }
    } else {
        // Update without the image
        $stmt_update = $conn->prepare("UPDATE announcement SET title = ?, content = ? WHERE announcement_id = ?");
        $stmt_update->bind_param("ssi", $title, $content, $announcement_id);

        if ($stmt_update->execute()) {
            $response['success'] = true;
            $response['message'] = 'Updated successfully';
        } else {
            $response['message'] = 'Database error: ' . $stmt_update->error;
        }
    }
} else {
    $response = ['success' => false, 'error' => "Can't connect to client"];
}

echo json_encode($response);
$conn->close();
