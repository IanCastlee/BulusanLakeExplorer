<?php
include("./header.php");
include("./conn.php");

if ($stmt = $conn->prepare("SELECT * FROM  bio")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $bio = [];

    while ($row = $result->fetch_assoc()) {
        $bio[] = $row;
    }
    $response['bio'] = $bio;
    $stmt->close();
} else {
    $response['error'] = "Problem on fetching data";
}

echo json_encode($response);
$conn->close();
