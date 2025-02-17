<?php
include("../header.php");
include("../conn.php");

if ($stmt = $conn->prepare("SELECT r.*, a.act_id, a.name  FROM  reviews AS r JOIN activities AS a ON r.act_id = a.act_id")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];

    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
    $response['reviews'] = $reviews;
    $stmt->close();
} else {
    $response['error'] = "Problem on fetching data";
}

echo json_encode($reviews);
$conn->close();
