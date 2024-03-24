import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import WeatherBox from "./components/WeatherBox";
import ClipLoader from "react-spinners/ClipLoader";

import { Button } from "react-bootstrap";

function App() {
  const apiKey = process.env.REACT_APP_API_KEY;

  const [weather, setWeather] = useState(null);
  const [boxWeather, setBoxWeather] = useState(null);
  const [loadingCurrentWeather, setLoadingCurrentWeather] = useState(false);
  const [loadingCityWeather, setLoadingCityWeather] = useState(false);
  const cities = ["seoul", "paris", "new york", "greece", "osaka"];
  const [selectedCity, setSelectedCity] = useState("seoul");

  const getCurrentLocationWeather = () => {
    setLoadingCurrentWeather(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch current location weather:", error);
      } finally {
        setLoadingCurrentWeather(false);
      }
    });
  };
  const getWeatherByCity = async (selectedCity) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;
    setLoadingCityWeather(true);
    try {
      let response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      let data = await response.json();
      setBoxWeather(data);
    } catch (error) {
      console.error("Failed to fetch weather by city:", error);
    } finally {
      setLoadingCityWeather(false);
    }

    setSelectedCity(selectedCity);
  };

  useEffect(() => {
    getCurrentLocationWeather();
    getWeatherByCity(selectedCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  return (
    <main className="main">
      <section className="section">
        <aside>
          {loadingCurrentWeather ? (
            <>
              <ClipLoader
                color="red"
                loading={loadingCurrentWeather}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </>
          ) : (
            <>
              <h2>현재 위치 날씨</h2>
              <h3>{weather?.name}</h3>
              <p>
                {weather?.main.temp}℃/
                {(weather?.main.temp * 1.8 + 32).toFixed(2)}℉
              </p>
              <p>{weather?.weather[0].description}</p>

              <img
                src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                alt=""
              />
            </>
          )}
        </aside>
        <article>
          {loadingCityWeather ? (
            <>
              <ClipLoader
                color="red"
                loading={loadingCityWeather}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </>
          ) : (
            <>
              <WeatherBox weather={boxWeather} />
              <div className="btn-area">
                {cities.map((cityName) => (
                  <Button
                    variant={selectedCity === cityName ? "primary" : "light"}
                    key={cityName}
                    onClick={() => getWeatherByCity(cityName)}
                  >
                    {cityName}
                  </Button>
                ))}
              </div>
            </>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;
