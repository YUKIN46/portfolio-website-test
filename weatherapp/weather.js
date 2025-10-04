 const API_KEY = "9d4caf93b614369b2c1ecd71b17f41dc";
  const weatherInfo = document.getElementById("weatherInfo");
  const forecastContainer = document.getElementById("forecast");
  const cityInput = document.getElementById("cityInput");
  const localTimeEl = document.getElementById("localTime");
  const themeSelect = document.getElementById("themeSelect");

  let currentTimeInterval = null;
  let currentTimezoneOffset = 0; // Store timezone offset here globally

  function toCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(1);
  }

  function showLoading() {
    weatherInfo.innerHTML = `<p class="loading">🔄 Loading weather data...</p>`;
    forecastContainer.innerHTML = "";
  }

  function displayWeather(data) {
    weatherInfo.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>${data.weather[0].description}</p>
      <p>🌡 Temp: ${toCelsius(data.main.temp)} °C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬 Wind: ${data.wind.speed} m/s</p>
    `;
  }

  function displayForecast(forecastList) {
    const filtered = forecastList.filter(entry => entry.dt_txt.includes("12:00:00"));
    forecastContainer.innerHTML = filtered.slice(0, 5).map(day => {
      const date = new Date(day.dt_txt);
      const icon = day.weather[0].icon;
      return `
        <div class="day">
          <div>${date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${day.weather[0].description}" />
          <div>${toCelsius(day.main.temp)}°C</div>
        </div>
      `;
    }).join("");
  }

  function showError(message) {
    weatherInfo.innerHTML = `<p class="error">❌ ${message}</p>`;
    forecastContainer.innerHTML = "";
  }

  async function getWeatherByCity() {
    const city = cityInput.value.trim();
    if (!city) return showError("Please enter a city name.");
    showLoading();

    try {
      const [curRes, foreRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`)
      ]);

      if (!curRes.ok || !foreRes.ok) throw new Error("City not found");

      const curData = await curRes.json();
      const foreData = await foreRes.json();

      displayWeather(curData);
      displayForecast(foreData.list);

      // Store the timezone offset globally
      currentTimezoneOffset = curData.timezone;

      // Start clock with stored timezone offset
      startClock(currentTimezoneOffset);

      // Apply theme based on stored timezone offset and selected mode
      applyThemeBasedOnTime(currentTimezoneOffset);

    } catch (err) {
      showError(err.message);
    }
  }

  async function getWeatherByLocation(lat, lon) {
    showLoading();
    try {
      const [curRes, foreRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      ]);

      const curData = await curRes.json();
      const foreData = await foreRes.json();

      displayWeather(curData);
      displayForecast(foreData.list);

      // Store timezone offset globally
      currentTimezoneOffset = curData.timezone;

      startClock(currentTimezoneOffset);
      applyThemeBasedOnTime(currentTimezoneOffset);

    } catch (err) {
      showError("Failed to fetch weather by location.");
    }
  }

  function startClock(timezoneOffsetSeconds) {
    if (currentTimeInterval) clearInterval(currentTimeInterval);

    function updateTime() {
      const nowUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
      const localMillis = nowUTC + timezoneOffsetSeconds * 1000;
      const localDate = new Date(localMillis);
      const hours = localDate.getHours().toString().padStart(2, "0");
      const mins = localDate.getMinutes().toString().padStart(2, "0");
      const secs = localDate.getSeconds().toString().padStart(2, "0");
      localTimeEl.textContent = `${hours}:${mins}:${secs}`;
    }
    updateTime();
    currentTimeInterval = setInterval(updateTime, 1000);
  }

  function applyThemeBasedOnTime(timezoneOffsetSeconds) {
    const nowUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localMillis = nowUTC + timezoneOffsetSeconds * 1000;
    const localDate = new Date(localMillis);
    const hour = localDate.getHours();

    const isDay = hour >= 6 && hour < 18;

    const themeMode = themeSelect.value;

    if (themeMode === "auto") {
      if (isDay) setLightTheme();
      else setDarkTheme();
    } else if (themeMode === "light") {
      setLightTheme();
    } else if (themeMode === "dark") {
      setDarkTheme();
    }
  }

  function setLightTheme() {
    document.body.style.background = "linear-gradient(to top right, #74ebd5, #acb6e5)";
    document.body.style.color = "#333";
  }

  function setDarkTheme() {
    document.body.style.background = "linear-gradient(to top right, #0f2027, #203a43, #2c5364)";
    document.body.style.color = "#fff";
  }

  themeSelect.addEventListener("change", () => {
    // Use stored timezone offset when toggling themes, default 0 if not known
    applyThemeBasedOnTime(currentTimezoneOffset || 0);
  });

  cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getWeatherByCity();
  });

  window.onload = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => getWeatherByLocation(coords.latitude, coords.longitude),
        (error) => {
          console.error("Geolocation error:", error);
          let errorMsg = "Location access denied. Search manually.";
          if (error.code === error.TIMEOUT) {
            errorMsg = "Location request timed out. Search manually.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = "Location unavailable. Search manually.";
          }
          showError(errorMsg);
          startClock(0);
          applyThemeBasedOnTime(0);
        },
        {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true
        }
      );
    } else {
      showError("Geolocation not supported.");
      startClock(0);
      applyThemeBasedOnTime(0);
    }
  };