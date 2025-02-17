<?php
include("../header.php");
include("../conn.php");

if ($stmt = $conn->prepare("SELECT * FROM termsandcondations WHERE intro != '' ORDER by id DESC")) {
    $stmt->execute();
    $result = ($stmt->get_result());

    $termsdata = [];

    while ($row = $result->fetch_assoc()) {
        $termsdata[] = $row;
    }

    $response['termsData'] = $termsdata;
    $stmt->close();
} else {

    $response['error'] = "Failed to prepare the SQL statement";
}

echo json_encode($response);
$conn->close();
