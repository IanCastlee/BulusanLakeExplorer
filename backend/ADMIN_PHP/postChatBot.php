<?php
include("../header.php");
include("../conn.php");

$res = ['success' => false];
if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $question = isset($_POST['question']) ? $_POST['question'] : null;
    $response = isset($_POST['response']) ? $_POST['response'] : null;
    $update_id = isset($_POST['id']) ? $_POST['id'] : null;
    $delete_id = isset($_POST['delete_id']) ? $_POST['delete_id'] : null;




    if ($delete_id) {
        // Delete record
        $stmt_delete = $conn->prepare("DELETE FROM chat_bot WHERE id = ?");
        $stmt_delete->bind_param("i", $delete_id);

        if ($stmt_delete->execute()) {
            $res['success'] = true;
            $res['msg'] = "Successfully deleted";
        } else {
            $res['error'] = "Error: " . $stmt_delete->error;
        }

        $stmt_delete->close();
    } else {
        $res['error'] = "No id to delete";
    }

    if ($response && $question) {

        if ($update_id) {
            // Update existing record
            $stmt_update = $conn->prepare("UPDATE chat_bot SET query = ?, response = ? WHERE id = ?");
            $stmt_update->bind_param("ssi", $question, $response, $update_id);

            if ($stmt_update->execute()) {
                $res['success'] = true;
                $res['msg'] = "Successfully updated";
            } else {
                $res['error'] = "Error : " . $stmt_update->error;
            }

            $stmt_update->close();
        } else {
            // Insert new record
            $stmt_insert = $conn->prepare("INSERT INTO chat_bot (query, response) VALUES(?, ?)");
            $stmt_insert->bind_param("ss", $question, $response);

            if ($stmt_insert->execute()) {
                $res['success'] = true;
                $res['msg'] = "Successfully added";
            } else {
                $res['error'] = "Error : " . $stmt_insert->error;
            }

            $stmt_insert->close();
        }
    } else {
        $res['error'] = "Fields are empty";
    }
} else {
    $res['error'] = "Invalid request";
}

echo json_encode($res);
$conn->close();
