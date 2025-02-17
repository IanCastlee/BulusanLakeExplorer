<?php
include("../header.php");
include("../conn.php");


$response = ['message' => "", 'success' => false, 'error' => ""];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {



    $msg_id = isset($_POST['msg_id']) ? $_POST['msg_id'] : null;
    $message = isset($_POST['message']) ? $_POST['message'] : null;
    $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null;
    $convo_id = isset($_POST['convo_id']) ? $_POST['convo_id'] : null;
    $reply = isset($_POST['reply']) ? $_POST['reply'] : null;
    $createdAt = date("Y-m-d H:i:s");
    $admin = 27;
    $status = 1;
    $statusAdmin = 2;

    if ($msg_id && $message && $user_id && $convo_id && $reply) {
        $stmt_insert = $conn->prepare("INSERT INTO chats (convo_id, user_id, reciever, message, notanswered, createdAt)VALUES(?,?,?,?,?,?)");
        $stmt_insert->bind_param("iiisis", $convo_id, $user_id, $admin, $message, $status, $createdAt);

        if ($stmt_insert->execute()) {
            $stmt_insert2 = $conn->prepare("INSERT INTO chats (convo_id, user_id, reciever, message, notanswered, createdAt)VALUES(?,?,?,?,?,?)");
            $stmt_insert2->bind_param("iiisis", $convo_id, $admin, $user_id, $reply, $statusAdmin, $createdAt);

            if ($stmt_insert2->execute()) {


                $stmt_update = $conn->prepare("UPDATE chats SET notanswered = 1 WHERE msg_id = '$msg_id'");
                if ($stmt_update->execute()) {

                    $stmt_insert2 = $conn->prepare("INSERT INTO chat_bot (query, response) VALUES(?, ?)");
                    $stmt_insert2->bind_param("ss", $message, $reply);

                    if ($stmt_insert2->execute()) {
                        $response['success'] = true;
                        $response['message'] = "Success";
                    } else {
                        $res['error'] = "Error : " . $stmt_insert2->error;
                    }
                } else {
                    $response['error'] = "Theres was a problem in inserting data 3";
                }
            } else {
                $response['error'] = "Theres was a problem in inserting data 2";
            }
        } else {
            $response['error'] = "Theres was a problem in inserting data 1";
        }
    } else {
        $response['error'] = "Data is empty";
    }
} else {
    $response['error'] = "Request failed";
}

echo json_encode($response);
