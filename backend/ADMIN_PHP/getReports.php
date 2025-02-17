<?php
include("../header.php");
include("../conn.php");

if ($stmt = $conn->prepare("SELECT * FROM  reports")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $reports = [];

    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }
    $response['reports'] = $reports;
    $stmt->close();
} else {
    $response['error'] = "Problem on fetching data";
}

echo json_encode($reports);
$conn->close();
