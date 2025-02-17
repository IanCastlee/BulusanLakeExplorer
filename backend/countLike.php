
<?php
include("./header.php");
include("./conn.php");




$stmt = $conn->prepare("SELECT COUNT(*) FROM likes AS likes_count");
