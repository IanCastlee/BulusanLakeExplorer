
<?php
include("../header.php");
include("../conn.php");



if ($stmt =  $conn->prepare("SELECT b.*, u.fullname,u.address,a.act_id,u.email, a.name, a.price FROM booking AS b JOIN users AS u ON b.user_id = u.user_id JOIN activities AS a ON b.act_id = a.act_id WHERE b.status = 'reserved' ORDER BY b.booked_id ASC")) {
    $stmt->execute();
    $result = $stmt->get_result();

    $confirmBook = [];


    while ($row = $result->fetch_assoc()) {
        $confirmBook[] = $row;
    }

    echo json_encode($confirmBook);
    $stmt->close();
} else {
    echo json_encode(['error' => "Failed to fetch data"]);
}

$conn->close();
