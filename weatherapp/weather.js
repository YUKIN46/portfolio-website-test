const API_KEY = "9d4caf93b614369b2c1ecd71b17f41dc";
    const weatherInfo = document.getElementById("weatherInfo");
    const forecastContainer = document.getElementById("forecast");
    const cityInput = document.getElementById("cityInput");
    const localTimeEl = document.getElementById("localTime");
    const themeSelect = document.getElementById("themeSelect");
    const backgroundContainer = document.getElementById("backgroundContainer");

    let currentTimeInterval = null;
    let currentTimezoneOffset = 0;
    let currentWeatherCondition = "";

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

    function applyWeatherTheme(weatherMain, weatherDescription, isDay) {
      currentWeatherCondition = weatherMain.toLowerCase();
      backgroundContainer.innerHTML = "";

      const body = document.body;
      
      // Clear weather - Sunny/Clear
      if (currentWeatherCondition === "clear") {
        if (isDay) {
          body.style.background = "linear-gradient(to bottom, #56CCF2, #2F80ED, #87CEEB)";
          // Add sun
          const sun = document.createElement('div');
          sun.className = 'sun';
          backgroundContainer.appendChild(sun);
        } else {
          body.style.background = "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)";
          body.style.color = "#fff";
          // Add moon and stars
          const moon = document.createElement('div');
          moon.className = 'moon';
          backgroundContainer.appendChild(moon);
          
          for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'stars';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 2 + 's';
            backgroundContainer.appendChild(star);
          }
        }
      }
      // Clouds
      else if (currentWeatherCondition === "clouds") {
        body.style.background = "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
        body.style.color = "#fff";
        
        // Add floating clouds with images
        const cloudImages = ['cloud.png', 'cloud1.png'];
        for (let i = 0; i < 5; i++) {
          const cloud = document.createElement('div');
          cloud.className = 'cloud';
          cloud.style.width = (150 + Math.random() * 150) + 'px';
          cloud.style.height = (60 + Math.random() * 40) + 'px';
          cloud.style.top = (10 + Math.random() * 60) + '%';
          cloud.style.left = -200 + 'px';
          cloud.style.backgroundImage = `url('${cloudImages[i % 2]}')`;
          cloud.style.backgroundRepeat = 'no-repeat';
          cloud.style.backgroundPosition = 'center';
          cloud.style.backgroundSize = 'contain';
          cloud.style.animationDuration = (20 + Math.random() * 20) + 's';
          cloud.style.animationDelay = (i * 5) + 's';
          backgroundContainer.appendChild(cloud);
        }
      }
      // Rain
      else if (currentWeatherCondition === "rain" || currentWeatherCondition === "drizzle") {
        body.style.background = "linear-gradient(to bottom, #4b6cb7, #182848)";
        body.style.color = "#fff";
        
        // Add rain drops
        for (let i = 0; i < 100; i++) {
          const rain = document.createElement('div');
          rain.className = 'rain weather-particle';
          rain.style.left = Math.random() * 100 + '%';
          rain.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
          rain.style.animationDelay = Math.random() * 2 + 's';
          backgroundContainer.appendChild(rain);
        }
      }
      // Thunderstorm
      else if (currentWeatherCondition === "thunderstorm") {
        body.style.background = "linear-gradient(to bottom, #141E30, #243B55)";
        body.style.color = "#fff";
        
        // Add rain and dark clouds
        for (let i = 0; i < 80; i++) {
          const rain = document.createElement('div');
          rain.className = 'rain weather-particle';
          rain.style.left = Math.random() * 100 + '%';
          rain.style.animationDuration = (0.3 + Math.random() * 0.3) + 's';
          rain.style.animationDelay = Math.random() * 1 + 's';
          backgroundContainer.appendChild(rain);
        }
      }
      // Snow
      else if (currentWeatherCondition === "snow") {
        body.style.background = "linear-gradient(to bottom, #E0EAFC, #CFDEF3)";
        body.style.color = "#333";
        
        // Add snowflakes
        for (let i = 0; i < 50; i++) {
          const snow = document.createElement('div');
          snow.className = 'snow weather-particle';
          snow.style.left = Math.random() * 100 + '%';
          snow.style.animationDuration = (3 + Math.random() * 3) + 's';
          snow.style.animationDelay = Math.random() * 3 + 's';
          backgroundContainer.appendChild(snow);
        }
      }
      // Mist/Fog/Haze
      else if (["mist", "fog", "haze", "smoke"].includes(currentWeatherCondition)) {
        body.style.background = "linear-gradient(to bottom, #606c88, #3f4c6b)";
        body.style.color = "#fff";
      }
      // Default
      else {
        body.style.background = "linear-gradient(to bottom, #74ebd5, #ACB6E5)";
        body.style.color = "#333";
      }
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

        currentTimezoneOffset = curData.timezone;
        startClock(currentTimezoneOffset);

        const nowUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        const localMillis = nowUTC + currentTimezoneOffset * 1000;
        const localDate = new Date(localMillis);
        const hour = localDate.getHours();
        const isDay = hour >= 6 && hour < 18;

        if (themeSelect.value === "auto") {
          applyWeatherTheme(curData.weather[0].main, curData.weather[0].description, isDay);
        }

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

        currentTimezoneOffset = curData.timezone;
        startClock(currentTimezoneOffset);

        const nowUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        const localMillis = nowUTC + currentTimezoneOffset * 1000;
        const localDate = new Date(localMillis);
        const hour = localDate.getHours();
        const isDay = hour >= 6 && hour < 18;

        if (themeSelect.value === "auto") {
          applyWeatherTheme(curData.weather[0].main, curData.weather[0].description, isDay);
        }

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

    themeSelect.addEventListener("change", () => {
      if (themeSelect.value === "manual") {
        document.body.style.background = "linear-gradient(to bottom, #74ebd5, #ACB6E5)";
        document.body.style.color = "#333";
        backgroundContainer.innerHTML = "";
      } else {
        getWeatherByCity();
      }
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
      }
    };