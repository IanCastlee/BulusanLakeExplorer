<?php
include("../header.php");
include("../conn.php");

$stmt  = $conn->prepare("SELECT * FROM  chat_bot");
$stmt->execute();
$result = $stmt->get_result();

$chatbot = [];

while ($row = $result->fetch_assoc()) {
    $chatbot[] = $row;
}
echo json_encode($chatbot);
$stmt->close();
$conn->close();
