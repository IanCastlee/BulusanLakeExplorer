<?php
include("../header.php");
include("../conn.php");

if ($stmt =  $conn->prepare("SELECT * FROM activities WHERE status = 'not active'")) {
    $stmt->execute();
    $result = $stmt->get_result();
    $activities = [];

    while ($row  = $result->fetch_assoc()) {
        $activities[] = $row;
    }

    echo json_encode($activities);
    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to fetch data"]);
}

$conn->close();
