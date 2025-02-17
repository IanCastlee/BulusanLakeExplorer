<?php
include("../header.php");
include("../conn.php");

if ($stmt =  $conn->prepare("SELECT i.*, u.email,p.post_id, p.caption FROM images AS i JOIN users AS u ON  i.user_id = u.user_id JOIN posts AS p ON p.post_id = i.post_id WHERE i.status = 2")) {

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
