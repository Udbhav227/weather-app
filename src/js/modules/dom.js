const DOMElements = {
  location: document.getElementById("location"),
  currentTemp: document.getElementById("current-temp"),
  currentCondition: document.getElementById("current-condition"),
  currentWeatherIcon: document.getElementById("current-weather-icon"),
  windSpeed: document.getElementById("wind-speed"),
  humidity: document.getElementById("humidity"),
  precipitation: document.getElementById("precipitation"),
  feelsLike: document.getElementById("feels-like"),
  hourlyContainer: document.getElementById("hourly-forecast-container"),
  dailyContainer: document.getElementById("daily-forecast-container"),
};

// Helper Functions
function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function formatTime(timeStr) {
  return timeStr.substring(0, 5);
}

async function getWeatherIcon(iconName) {
  try {
    const module = await import(`../../assets/icons/${iconName}.svg`);
    return `<img src="${module.default}" alt="${iconName}">`;
  } catch (error) {
    console.warn(`Could not load icon: ${iconName}`, error);
    return `<span title="Icon not found">?</span>`;
  }
}

// Render Functions
async function renderCurrentWeather(weatherData) {
  DOMElements.location.textContent = weatherData.location.split(",")[0];
  DOMElements.currentTemp.textContent = `${Math.round(weatherData.currentTemp)}°`;
  DOMElements.currentCondition.textContent = weatherData.description;

  const iconHTML = await getWeatherIcon(weatherData.icon);
  DOMElements.currentWeatherIcon.innerHTML = iconHTML;
}

function renderWeatherDetails(weatherData) {
  DOMElements.windSpeed.textContent = `${weatherData.windSpeed} km/h`;
  DOMElements.humidity.textContent = `${weatherData.humidity} %`;
  DOMElements.precipitation.textContent = `${weatherData.precip} %`;
  DOMElements.feelsLike.textContent = `${Math.round(weatherData.feelsLike)}°`;
}

async function renderHourlyForecast(weatherData) {
  DOMElements.hourlyContainer.innerHTML = "";
  const nextHours = weatherData.hourlyForecast.slice(0, 5);

  // 1. Create an array of promises for all the icons
  const iconPromises = nextHours.map((hour) => getWeatherIcon(hour.icon));

  // 2. Wait for all promises to resolve
  const iconHTMLs = await Promise.all(iconPromises);

  // 3. Now that you have all the data, build the HTML
  let finalHTML = "";
  nextHours.forEach((hour, index) => {
    finalHTML += `
    <div class="hourly-item">
      <span>${formatTime(hour.time)}</span>
      ${iconHTMLs[index]}  <span>${Math.round(hour.temp)}°C</span>
    </div>
  `;
  });

  DOMElements.hourlyContainer.innerHTML = finalHTML;
}

async function renderDailyForecast(weatherData) {
  DOMElements.dailyContainer.innerHTML = "";
  const nextDays = weatherData.dailyForecast.slice(1, 8);

  // 1. Create an array of promises for all the icons
  const iconPromises = nextDays.map((day) => getWeatherIcon(day.icon));

  // 2. Wait for all promises to resolve
  const iconHTMLs = await Promise.all(iconPromises);

  // 3. Now build the HTML
  let finalHTML = "";
  nextDays.forEach((day, index) => {
    finalHTML += `
    <div class="daily-item">
      <span class="daily-item-day">${getDayName(day.date)}</span>
      <div class="daily-item-condition">
          ${iconHTMLs[index]} <span>${day.conditions}</span>
      </div>
      <span class="daily-item-temp">${Math.round(day.tempMax)}°/${Math.round(day.tempMin)}°</span>
    </div>
  `;
  });

  DOMElements.dailyContainer.innerHTML = finalHTML;
}

export default async function updateUI(weatherData) {
  if (!weatherData) return;
  await renderCurrentWeather(weatherData);
  renderWeatherDetails(weatherData);
  await renderHourlyForecast(weatherData);
  await renderDailyForecast(weatherData);
}
