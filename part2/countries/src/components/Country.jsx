import { useEffect, useState } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital?.[0]
  // Extract latitude and longitude from capitalInfo
  const [lat, lon] = country.capitalInfo?.latlng || []
  const apiKey = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (lat === undefined || lon === undefined) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      )
      .then((response) => {
        setWeather(response.data)
      })
      .catch((error) => console.error('Error fetching weather:', error))
  }, [lat, lon, apiKey])

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital: {capital}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages || {}).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="150"
      />

      {weather && (
        <div>
          <h2>Weather in {capital}</h2>
          <p>Temperature: {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default Country
