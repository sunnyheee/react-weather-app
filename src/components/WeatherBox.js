import React from "react";

const WeatherBox = ({ weather }) => {
  const f =
    weather && weather.main ? (weather.main.temp * 1.8 + 32).toFixed(2) : null;

  return (
    <div>
      <h2>{weather?.name} 날씨</h2>
      <p>
        {weather?.main.temp}℃/{f} ℉
      </p>
      <p>{weather?.weather[0].description}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
        alt=""
      />
    </div>
  );
};

export default WeatherBox;
