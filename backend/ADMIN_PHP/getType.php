<?php
include("../header.php");
include("../conn.php");



if ($stmt = $conn->prepare("SELECT * FROM biotype")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $types = [];

    while ($row = $result->fetch_assoc()) {
        $types[] = $row;
    }

    $response['types'] = $types;
    $stmt->close();
} else {
    $response['error'] = "Failed to prepare the SQL statement";
}

echo json_encode($response);
$conn->close();
