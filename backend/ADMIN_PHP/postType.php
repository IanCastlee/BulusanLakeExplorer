<?php
include("../header.php");
include("../conn.php");

$response = ["success" => false];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'];



    if ($type) {
        $stmt_checking = $conn->prepare("SELECT * FROM biotype WHERE type = ?");
        $stmt_checking->bind_param("s", $type);
        $stmt_checking->execute();
        $result = $stmt_checking->get_result();

        if ($result->num_rows > 0) {
            $response['message'] = 'Biodiversity type is already exist.';
            $stmt_checking->close();
        } else {
            $stmt = $conn->prepare("INSERT INTO biotype (type)VALUES(?)");
            $stmt->bind_param('s', $type);
            if ($stmt->execute()) {
                $response['success'] = true;
            }
            $stmt->close();
        }
    }
} else {
    $response['error'] = "Unable to insert bio type";
}

echo json_encode($response);

$conn->close();
