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
    $name = $_POST['name'];
    $price = $_POST['price'];
    $discount = $_POST['discount'];
    $resfee = $_POST['resfee'];
    $duration = $_POST['duration'];
    $maxreservation = $_POST['maxreservation'];
    $quantity = $_POST['quantity'];
    $pricing_details = $_POST['pricing_details'];
    $tagline = $_POST['tagline'];
    $note = $_POST['note'];
    $description = $_POST['description'];
    $noteReservation = $_POST['noteReservation'];
    $act_id = $_POST['act_id'];



    if (!empty($_FILES['image']['name'])) {
        $filename = generateUniqueFilename($_FILES['image']);
        $tempname = $_FILES['image']['tmp_name'];
        $folder = './uploads/' . $filename;

        if (move_uploaded_file($tempname, $folder)) {
            $stmt = $conn->prepare("UPDATE activities SET name = ?, price = ?, pricing_details = ?, discount = ?, maxreservation = ?, quantity = ?, duration = ?, tagline = ?, image = ?, description = ?, important_notice = ?, note = ?, reservation_fee = ? WHERE act_id = ?");
            $stmt->bind_param("sssiiissssssii", $name, $price, $pricing_details, $discount, $maxreservation, $quantity, $duration, $tagline, $filename, $description, $note, $noteReservation, $resfee, $act_id);


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
        $stmt = $conn->prepare("UPDATE activities SET name = ?, price = ?, pricing_details=?,  discount = ?, duration = ?, maxreservation = ?, quantity =?, tagline = ?,description = ?, important_notice = ?,   note = ?, reservation_fee = ?  WHERE act_id = ?");
        $stmt->bind_param("sssisiissssii", $name, $price, $pricing_details, $discount, $duration, $maxreservation, $quantity, $tagline, $description, $note, $noteReservation, $resfee, $act_id);

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
