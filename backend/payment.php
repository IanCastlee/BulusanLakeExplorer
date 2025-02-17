<?php
include("./header.php");
include("./conn.php");

header('Content-Type: application/json');

if (isset($_POST['amount']) && isset($_POST['description']) && isset($_POST['remarks'])) {
    $amount = $_POST['amount'];
    $description = $_POST['description'];
    $remarks = $_POST['remarks'];

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://api.paymongo.com/v1/links");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Authorization: Basic c2tfdGVzdF9tZ3J6Rnl5TDRvSm9LSlhOQkROcFJ2OVA6',
        'Content-Type: application/json',
    ]);

    $data = [
        "data" => [
            "attributes" => [
                "amount" => (int)$amount,
                "description" => $description,
                "remarks" => $remarks,
                "redirect" => [
                    "success" => "http://localhost:5173/",
                    "failed" => "http://localhost:5173/"
                ],
            ]
        ]
    ];

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    } else {
        $decodedResponse = json_decode($response, true);
        if (isset($decodedResponse['data']['attributes']['checkout_url'])) {
            echo json_encode(['checkout_url' => $decodedResponse['data']['attributes']['checkout_url']]);
        } else {
            echo json_encode(['error' => 'Unable to fetch the checkout URL.']);
        }
    }

    curl_close($ch);
} else {
    echo json_encode(['error' => 'Missing required parameters.']);
}
