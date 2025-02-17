<?php
include("./header.php");


$apiKey = '3yweEDgNjLjaXsk2wRATN8RkAz4W46rX';
$locationKey = '266037';

// API endpoints
$currentConditionsUrl = "http://dataservice.accuweather.com/currentconditions/v1/$locationKey?apikey=$apiKey";
$forecastUrl = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/$locationKey?apikey=$apiKey&metric=true";

// Make API requests
$currentConditionsResponse = file_get_contents($currentConditionsUrl);
$forecastResponse = file_get_contents($forecastUrl);

$response = [];

if ($currentConditionsResponse === false || $forecastResponse === false) {
    $response['error'] = "Error fetching data.";
} else {
    $currentConditionsData = json_decode($currentConditionsResponse, true);
    $forecastData = json_decode($forecastResponse, true);

    if (empty($currentConditionsData)) {
        $response['current'] = "No current weather data available.";
    } else {
        $currentTemperature = $currentConditionsData[0]['Temperature']['Metric']['Value'];
        $weatherIcon = str_pad($currentConditionsData[0]['WeatherIcon'], 2, '0', STR_PAD_LEFT);
        $iconUrl = "https://developer.accuweather.com/sites/default/files/{$weatherIcon}-s.png";

        $response['current'] = [
            'temperature' => $currentTemperature,
            'icon' => $iconUrl
        ];
    }

    if (empty($forecastData['DailyForecasts'])) {
        $response['forecast'] = "No forecast data available.";
    } else {
        $response['forecast'] = [];

        foreach ($forecastData['DailyForecasts'] as $day) {
            $date = date('Y-m-d', strtotime($day['Date']));
            $maxTemp = $day['Temperature']['Maximum']['Value'];
            $minTemp = $day['Temperature']['Minimum']['Value'];
            $weatherIcon = str_pad($day['Day']['Icon'], 2, '0', STR_PAD_LEFT);
            $iconUrl = "https://developer.accuweather.com/sites/default/files/{$weatherIcon}-s.png";

            $response['forecast'][] = [
                'date' => $date,
                'maxTemp' => $maxTemp,
                'minTemp' => $minTemp,
                'icon' => $iconUrl
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
