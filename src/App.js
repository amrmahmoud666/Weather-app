import { useState, useEffect  } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { IoMdSearch } from "react-icons/io";
import './App.css'

function App() {

  const [city, setCity] = useState('Cairo')
  const [weather, setWeather] = useState(null)
  const [forecast, setForcast] = useState(null)

  

  const getWeather = async () => {
    if (!city) return;

    const apiKey = '1e3b790ab0daf25e21128452b047be42'; 
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`

    try {
      const [currentRes, forecastRes] = await Promise.all ([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]) 
      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();
      setWeather(currentData);

      const daily = forecastData.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5)
      
      setForcast(daily)

    } catch (error) {
      console.error("Error fetching weather data:", error)
    }
  }

  useEffect(() => {
    getWeather();
  }, []);

  const weatherVideos = {
  rain: "/rain.gif",
  clouds: "/loop clouds GIF.gif",
  clear: "/sky GIF.gif",
  snow: "/snow GIF.gif"
};

const currentWeather = weather?.weather[0].main.toLowerCase();



  return (
    <div className={`container-fluid text-center min-vh-100 
  ${weather ? weather.weather[0].main.toLowerCase() : 'default'}`}>
      {currentWeather && weatherVideos[currentWeather] && (
      <div className="weather-bg">
        <img loading='lazy' src={weatherVideos[currentWeather]} alt="weather background" className="background-video" />
      </div>
      )}
      <div className='content'>
        <h1>Weather App</h1>
        <div className='d-flex align-items-center mx-auto justify-content-center'>
      <input
        type='text'
        className='form-control input-control w-50 my-3 '
        placeholder='Enter city'
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') getWeather()
        }}
      />
      <button className='btn btn-primary search text-center' onClick={getWeather}><IoMdSearch size={20} /></button>
        </div>

      {weather ? (
        <div className='current-card card p-3 mx-auto' style={{ width: '18rem' }}>
          <h3>{weather.name}</h3>
          <img 
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
          alt={weather.weather[0].description} 
          />
          <p>Temperature: {Math.round(weather.main.temp)}</p>
          <p>Country: {weather.sys.country}</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humadity: {weather.main.humidity}</p>
      </div>
      ): (
          <p className='text-danger'>Loding weather...</p>
      )}
      
      
      {forecast && (
        <div className='forecast-container d-flex justify-content-center gap-3 mt-4'>
          {forecast.map((day, index) => (
            <div key={index} className='forecast-day card text-center p-3'>
              <p>{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <img 
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
              alt={day.weather[0].description} 
              />
              <p>Temperature: {Math.round(day.main.temp)}</p>
              <p>Country: {day.sys.country}</p>
              <p>Weather: {day.weather[0].description}</p>
              <p>Humidity: {day.main.humidity}</p>
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
  );
}

export default App;
