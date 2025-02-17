<?php
include("../header.php");
include("../conn.php");

if ($stmt =  $conn->prepare("SELECT * FROM images WHERE status = 1")) {

    $stmt->execute();
    $result = $stmt->get_result();
    $images = [];

    while ($row  = $result->fetch_assoc()) {
        $images[] = $row;
    }

    echo json_encode($images);
    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to fetch data"]);
}

$conn->close();
