<?php
include("../header.php");
include("../conn.php");

$status = 1;
$v_status = 1;
$acc_type = 'admin_111';


if ($stmt =  $conn->prepare("SELECT * FROM users WHERE status = '$status' AND verify_status = '$v_status' AND acc_type != '$acc_type' ")) {

    $stmt->execute();
    $result = $stmt->get_result();
    $users = [];

    while ($row  = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode($users);
    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to fetch data"]);
}

$conn->close();
