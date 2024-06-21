import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (searchItem.trim() === "") {
      setCountries([]);
      return;
    }

    const fetchCountry = async () => {
      try {
        const api = `https://restcountries.com/v3.1/name/${searchItem}`;
        const response = await axios.get(api);
        setCountries(response.data);
        setSelectedCountry(null);
        setWeather(null);
        setApiError(null);
      } catch (error) {
        console.error(error);
        setApiError("Error fetching countries");
      }
    };
    fetchCountry();
  }, [searchItem]);

  useEffect(() => {
    if (selectedCountry && selectedCountry.capital) {
      fetchWeather(selectedCountry.capital[0]);
    }
  }, [selectedCountry]);

  const fetchWeather = async (capital) => {
    try {
      const apiKey = import.meta.env.VITE_SOME_KEY;
      const apiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;
      const weatherResponse = await axios.get(apiWeather);
      setWeather(weatherResponse.data);
      setApiError(null);
    } catch (error) {
      console.error(error);
      setWeather(null);
      setApiError("Error fetching weather data");
    }
  };

  const renderLanguage = (languages) => {
    if (Array.isArray(languages)) {
      return languages.join(", ");
    } else if (typeof languages === "object") {
      return Object.values(languages).join(", ");
    } else {
      return "Unknown";
    }
  };

  const handleShowButton = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <label>
        Find countries <br />
        <input
          type="text"
          value={searchItem}
          onChange={(event) => setSearchItem(event.target.value)}
        ></input>
      </label>

      {countries.length > 10 && <p>Too many matches, specify another filter</p>}

      {countries.length <= 10 && countries.length > 0 && (
        <div>
          <h3>Countries</h3>
          <ul>
            {countries.map((country) => (
              <li key={country.name.common}>
                {country.name.common}{" "}
                <button onClick={() => handleShowButton(country)}>SHOW</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedCountry && (
        <div>
          <h3>{selectedCountry.name.common}</h3>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} m2</p>

          <p>
            Languages:{" "}
            {selectedCountry.languages &&
              renderLanguage(selectedCountry.languages)}
          </p>

          <p>Flag:</p>
          <img src={selectedCountry.flags.png} alt="FLAG"></img>
          <p>Coat of arms:</p>
          <img src={selectedCountry.coatOfArms.png} alt="COAT OF ARMS"></img>

          <p>Weather Data:</p>
          {weather && (
            <div>
              <h4>Weather in {selectedCountry.capital[0]}</h4>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Weather description: {weather.weather[0].description}</p>
              {weather.weather[0].icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                    alt="WEATHER ICON"
                  ></img>
                )}
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind speed: {weather.wind.speed} m/s</p>
            </div>
          )}

          {apiError && <p>{apiError}</p>}
        </div>
      )}
    </div>
  );
};

export default App;
