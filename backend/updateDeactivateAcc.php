<?php
include("./header.php");
include("./conn.php");

$res = ['success' => false];
if (isset($_POST['id'])) {

    $status = 2;  // Deactivated status
    $status_1 = 1;  // Activated status
    $id = $_POST['id'];  // Fetch the id from POST data

    $stmt_checkStatus = $conn->prepare("SELECT * FROM users WHERE status = ? AND user_id = ?");
    $stmt_checkStatus->bind_param("ii", $status, $id);
    $stmt_checkStatus->execute();
    $stmt_checkStatus->store_result();

    // If the user is deactivated, activate the user
    if ($stmt_checkStatus->num_rows > 0) {
        $stmt_update = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
        $stmt_update->bind_param("ii", $status_1, $id);  // Activate the user

        if ($stmt_update->execute()) {
            $res['success'] = true;
            $res['message'] = 1;
        } else {
            $res['error'] = "Unable to update";
        }
    } else {
        // If the user is activated, deactivate the user
        $stmt_update = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
        $stmt_update->bind_param("ii", $status, $id);  // Deactivate the user

        if ($stmt_update->execute()) {
            $res['success'] = true;
            $res['message'] = 2;
        } else {
            $res['error'] = "Unable to update";
        }
    }
} else {
    $res['error'] = "Invalid request";
}

echo json_encode($res);
$conn->close();
