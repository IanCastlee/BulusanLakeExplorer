<?php
include("./header.php");
include("./conn.php");

$type = isset($_GET['type']) ? trim($_GET['type']) : '';
$characteristic = isset($_GET['characteristic']) ? trim($_GET['characteristic']) : '';
$response = [];

$sql = "SELECT * FROM bio WHERE 1=1"; // Start with a base query

if (!empty($type)) {
    $sql .= " AND type LIKE '%$type%'";
}

if (!empty($characteristic)) {
    $sql .= " AND characteristic LIKE '%$characteristic%'";
}

$result = mysqli_query($conn, $sql);

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = $row;
    }
} else {
    $response['error'] = 'Database error: ' . mysqli_error($conn);
}

echo json_encode($response);
