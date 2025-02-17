<?php
include("../header.php");
include("../conn.php");

if ($stmt = $conn->prepare("SELECT * FROM announcement ORDER BY CASE WHEN status = 'Active Announcement' THEN 1 ELSE 2 END, createdAt DESC")) {
    $stmt->execute();
    $result = $stmt->get_result();
    $announcement = [];

    while ($row = $result->fetch_assoc()) {
        $announcement[] = $row;
    }

    echo json_encode($announcement);
    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to fetch data"]);
}

$conn->close();
