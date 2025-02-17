<?php
include("../header.php");
include("../conn.php");

$response = ['success' => false, 'error' => "", 'message' => ""];
if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $review_id = isset($_POST['review_id']) ? $_POST['review_id'] : null;

    if ($review_id) {
        $stmt_delete = $conn->prepare('DELETE FROM reviews WHERE review_id = ?');
        $stmt_delete->bind_param("i", $review_id);

        if ($stmt_delete->execute()) {
            $response = ['success' => true, 'message' => "Review deleted successfully"];
        } else {
            $response = ['success' => false, 'error' => "There was a problem in deleting the data"];
        }
    } else {
        $response = ['success' => false, 'error' => "Data from client is empty"];
    }
} else {
    $response = ['success' => false, 'error' => "Can't connect to client"];
}

echo json_encode($response);

$conn->close();
