<?php
include("./header.php");
include("./conn.php");

$status = "Active announcement";


if ($stmt =  $conn->prepare("SELECT * FROM announcement WHERE status = '$status' ORDER BY status = '$status' DESC")) {
    $stmt->execute();
    $result = $stmt->get_result();
    $announcement = [];

    while ($row  = $result->fetch_assoc()) {
        $announcement[] = $row;
    }

    echo json_encode($announcement);
    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to fetch data"]);
}

$conn->close();
