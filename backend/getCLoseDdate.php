<?php
include("./header.php");
include("./conn.php");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Prepare the SQL query to fetch dates
$stmt_get_date = $conn->prepare("SELECT date FROM announcement WHERE date IS NOT NULL AND date != ''");

$stmt_get_date->execute();
$result = $stmt_get_date->get_result();

$response = [];
$date = [];

// Function to adjust the date (subtract one day)
function adjustDate($originalDate)
{
    $date = new DateTime($originalDate);
    $date->modify('-1 day');
    return $date->format('Y-m-d');
}

// Fetch each date, adjust if necessary, and add to the array
while ($row = $result->fetch_assoc()) {
    // Adjust date and add it to the array
    $adjustedDate = adjustDate($row['date']);
    $date[] = $adjustedDate;
}

// Prepare the response
$response['date'] = $date;

// Set header to ensure the response is sent as JSON
header('Content-Type: application/json');

// Output the JSON response
echo json_encode($response);

// Close the statement
$stmt_get_date->close();
