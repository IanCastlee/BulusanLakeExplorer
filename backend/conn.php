

<?php
$host = "localhost"; // Your host name
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "blexplorer"; // Your database name

// Create connection
$conn = mysqli_connect($host, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
