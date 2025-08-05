// NOTE: For production, do not expose API keys in client-side JavaScript.
const apiKey = "7d5e74e7b112e34001dc87b79a2fc7c3";
const cityInput = document.getElementById("cityInput");

// --- Load default city on startup ---
document.addEventListener("DOMContentLoaded", () => {
  fetchWeather("Bhubaneswar");
});

// --- Allow Enter key to trigger fetch ---
cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    getWeatherFromInput();
  }
});

// --- Core Function: Get Weather from Input ---
function getWeatherFromInput() {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  fetchWeather(city);
  cityInput.value = ""; // Clear input field after search
}

// --- Fetch Weather Data from API ---
function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`City not found (${res.status})`);
      }
      return res.json();
    })
    .then((data) => {
      displayWeatherData(data);
    })
    .catch((error) => {
      alert(error.message);
      console.error("Error fetching weather data:", error);
    });
}

// --- Display Data in the UI ---
function displayWeatherData(data) {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const mainWeather = data.weather[0].main;
  const desc = data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
  const icon = getWeatherIcon(mainWeather);
  const cityName = data.name;
  const country = data.sys.country;
  const sunrise = formatTime(data.sys.sunrise);
  const sunset = formatTime(data.sys.sunset);

  // Update Left Panel
  document.getElementById("location").textContent = `📍 ${cityName}, ${country}`;
  document.getElementById("sunTime").textContent = `${sunrise} 🌅 — ${sunset} 🌇`;
  document.getElementById("temperature").textContent = `${temp}°`;
  document.getElementById("weatherMain").textContent = `${icon} ${mainWeather}`;

  // Update Right Panel
  document.getElementById("info-temp").textContent = `${temp}°C`;
  document.getElementById("info-feels").textContent = `${feels}°C`;
  document.getElementById("info-humidity").textContent = `${humidity}%`;
  document.getElementById("info-wind").textContent = `${wind} km/h`;
  document.getElementById("info-desc").textContent = desc;
  document.getElementById("info-sunrise").textContent = sunrise;
  document.getElementById("info-sunset").textContent = sunset;

  // Trigger CSS transitions
  document.getElementById("location").classList.add("loaded");
  document.getElementById("sunTime").classList.add("loaded");
  document.getElementById("temperature").classList.add("loaded");
  document.getElementById("weatherMain").classList.add("loaded");
}

// --- Format Time Helper ---
function formatTime(unixTimestamp) {
  return new Date(unixTimestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --- Emoji Icon Helper ---
function getWeatherIcon(condition) {
  switch (condition) {
    case "Clear": return "☀";
    case "Clouds": return "☁";
    case "Rain": return "🌧";
    case "Drizzle": return "🌦";
    case "Thunderstorm": return "⛈";
    case "Snow": return "❄";
    case "Mist":
    case "Smoke":
    case "Haze":
    case "Dust":
    case "Fog":
    case "Sand":
    case "Ash":
    case "Squall":
    case "Tornado": return "🌫";
    default: return "🌍";
  }
}
