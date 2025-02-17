<?php
include("../header.php");
include("../conn.php");

$response = ['success' => false, 'error' => "", 'message' => ''];

$stmt_get_data = $conn->prepare("SELECT * FROM other_fees");

if ($stmt_get_data) {
    $stmt_get_data->execute();
    $result = $stmt_get_data->get_result();

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $response['success'] = true;
    $response['data'] = $data;
} else {
    $response = ['success' => false, 'error' => "Can't fetch data"];
}

$conn->close();

echo json_encode($response);
