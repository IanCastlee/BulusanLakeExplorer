import React, { useState, useEffect } from "react";
import axios from "axios";
import "./weather.scss";
import config from "../../BaseURL";

const Weather = ({ closeWeather }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}backend/weather.php`)
      .then((response) => {
        const data = response.data;
        if (data.error) {
          setError(data.error);
        } else {
          setCurrentWeather(data.current);
          setForecast(data.forecast);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data.");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="weather">
      <div className="weather-top">
        <div className="t">
          <h3>Bulusan Lake weather</h3>
          <span>(accuracy 80%)</span>
        </div>
        <i className="bi bi-x-lg close2" onClick={closeWeather}></i>
      </div>

      <div className="content">
        {loading && <span className="loader"></span>}
        {error && <div className="error">{error}</div>}
        {!loading && currentWeather && (
          <div className="current-weather">
            <h4>Current Temperature: {currentWeather.temperature} °C</h4>
            {currentWeather.icon && (
              <img src={currentWeather.icon} alt="Weather Icon" />
            )}
          </div>
        )}
        {!loading && forecast ? (
          <div className="forecast">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <div className="day-icon">
                  <h5>{formatDate(day.date)}</h5>
                  {day.icon && <img src={day.icon} alt="Weather Icon" />}
                </div>
                <p>Max Temp: {day.maxTemp} °C</p>
                <p>Min Temp: {day.minTemp} °C</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Check your internet connection</p>
        )}
      </div>
    </div>
  );
};

export default Weather;
