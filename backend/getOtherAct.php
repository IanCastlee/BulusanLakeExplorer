<?php
include("./header.php");
// Include your database connection
include("./conn.php");

$oid = isset($_GET['id']) ? $_GET['id'] : '';

if ($stmt = $conn->prepare("SELECT * FROM activities WHERE act_id != ? AND status = 'active'")) {
    $stmt->bind_param("i", $oid);
    $stmt->execute();
    $result = $stmt->get_result();
    $activities = [];

    while ($row = $result->fetch_assoc()) {
        $activities[] = $row;
    }

    echo json_encode($activities);
    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to prepare the SQL statement"]);
}

$conn->close();
