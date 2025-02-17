<?php
include("../header.php");
include("../conn.php");



$response = ['success' => false, 'error' => "",  'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $entrance_fee = $_POST['entrance_fee'] ?? null;
    $environmental_fee = $_POST['environmental_fee'] ?? null;
    $parking_fee = $_POST['parking_fee'] ?? null;
    $shuttle_service_fee = $_POST['shuttle_service_fee'] ?? null;
    $service_charge = $_POST['service_charge'] ?? null;
    $fee_id = isset($_POST['fee_id']) ? $_POST['fee_id'] : null;




    if ($entrance_fee && $environmental_fee && $parking_fee && $shuttle_service_fee && $service_charge) {

        if ($fee_id) {
            $stmt_update_data = $conn->prepare("UPDATE other_fees SET entrance_fee = ?, environmental_fee = ?,parking_fee = ?, shuttle_service_fee = ?, service_charge = ? WHERE fee_id =?");
            $stmt_update_data->bind_param("sssssi", $entrance_fee, $environmental_fee, $parking_fee, $shuttle_service_fee, $service_charge, $fee_id);

            if ($stmt_update_data->execute()) {
                $response = ['success' => true,  'message' => "Succesfully Updated"];
            }
        } else {
            $stmt_insert_data = $conn->prepare("INSERT INTO other_fees (entrance_fee,environmental_fee,parking_fee,shuttle_service_fee,service_charge)VALUES(?,?,?,?,?)");
            $stmt_insert_data->bind_param("sssss", $entrance_fee, $environmental_fee, $parking_fee, $shuttle_service_fee, $service_charge);

            if ($stmt_insert_data->execute()) {
                $response = ['success' => true,  'message' => "Succesfully Inserted"];
            }
        }
    } else {
        $response = ['success' => false, 'error' => "Some data from frontend is empty"];
    }
} else {
    $response = ['success' => false, 'error' => "Cant connect to frontend"];
}
echo json_encode($response);
$conn->close();
