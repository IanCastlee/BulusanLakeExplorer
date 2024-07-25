<?php
// header('Access-Control-Allow-Origin: http://blsnadmin.free.nf/');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

include("./conn.php");



if ($stmt =  $conn->prepare("SELECT * FROM activities")) {
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
