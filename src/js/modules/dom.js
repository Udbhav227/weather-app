import { getTemp, getSpeed, getDistance, getUnitSystem } from "./units";

const DOMElements = {
  location: document.getElementById("location"),
  parentLocation: document.getElementById("parent-location"),
  currentTemp: document.getElementById("current-temp"),
  currentCondition: document.getElementById("current-condition"),
  currentWeatherIcon: document.getElementById("current-weather-icon"),
  currentWeatherDescription: document.getElementById(
    "current-weather-description",
  ),
  windSpeed: document.getElementById("wind-speed"),
  humidity: document.getElementById("humidity"),
  feelsLike: document.getElementById("feels-like"),
  uvCard: document.getElementById("uv-card"),
  visibility: document.getElementById("visibility"),
  moonPhaseCard: document.getElementById("moon-phase-card"),
  hourlyContainer: document.getElementById("hourly-forecast-container"),
  dailyContainer: document.getElementById("daily-forecast-container"),
  unitToggleBtn: document.getElementById("unit-toggle-btn"),
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
    const fallback = await import(`../../assets/icons/not-available.svg`);
    return `<img src="${fallback.default}" alt="not available">`;
  }
}

async function getUvIconPath(uvIndex) {
  const roundedUv = Math.min(Math.max(Math.round(uvIndex), 0), 11);
  try {
    const module = await import(`../../assets/icons/uv-index-${roundedUv}.svg`);
    return module.default;
  } catch (error) {
    console.warn(`Could not load UV index icon for value: ${roundedUv}`, error);
    const fallback = await import(`../../assets/icons/not-available.svg`);
    return fallback.default;
  }
}

async function getMoonPhaseDetails(moonPhaseValue) {
  try {
    if (moonPhaseValue === 0) {
      const module = await import(`../../assets/icons/moon-new.svg`);
      return { name: "New", icon: module.default };
    }
    if (moonPhaseValue > 0 && moonPhaseValue < 0.25) {
      const module = await import(
        `../../assets/icons/moon-waxing-crescent.svg`
      );
      return { name: "Wax Cres", icon: module.default };
    }
    if (moonPhaseValue === 0.25) {
      const module = await import(`../../assets/icons/moon-first-quarter.svg`);
      return { name: "1st Qtr", icon: module.default };
    }
    if (moonPhaseValue > 0.25 && moonPhaseValue < 0.5) {
      const module = await import(`../../assets/icons/moon-waxing-gibbous.svg`);
      return { name: "Wax Gib", icon: module.default };
    }
    if (moonPhaseValue === 0.5) {
      const module = await import(`../../assets/icons/moon-full.svg`);
      return { name: "Full", icon: module.default };
    }
    if (moonPhaseValue > 0.5 && moonPhaseValue < 0.75) {
      const module = await import(`../../assets/icons/moon-waning-gibbous.svg`);
      return { name: "Wan Gib", icon: module.default };
    }
    if (moonPhaseValue === 0.75) {
      const module = await import(`../../assets/icons/moon-last-quarter.svg`);
      return { name: "Last Qtr", icon: module.default };
    }
    const module = await import(`../../assets/icons/moon-waning-crescent.svg`);
    return { name: "Wan Cres", icon: module.default };
  } catch (error) {
    console.warn(
      `Could not load moon phase icon for value: ${moonPhaseValue}`,
      error,
    );
    const fallback = await import(`../../assets/icons/not-available.svg`);
    return { name: "Unknown", icon: fallback.default };
  }
}

// Render Functions
async function renderCurrentWeather(weatherData) {
  const [city] = weatherData.location.split(",");
  DOMElements.location.textContent = city;
  DOMElements.parentLocation.textContent = weatherData.location
    .split(",")
    .slice(1)
    .join(", ");

  const temp = getTemp(weatherData.currentTemp);
  DOMElements.currentTemp.innerHTML = `${temp.value}<span class="current-temp-unit">${temp.unit}</span>`;
  DOMElements.unitToggleBtn.textContent = temp.unit;

  DOMElements.currentCondition.textContent = weatherData.description;
  DOMElements.currentWeatherDescription.textContent =
    weatherData.weatherDescription;

  const iconHTML = await getWeatherIcon(weatherData.icon);
  DOMElements.currentWeatherIcon.innerHTML = iconHTML;
}

async function renderWeatherDetails(weatherData) {
  const wind = getSpeed(weatherData.windSpeed);
  DOMElements.windSpeed.textContent = `${wind.value} ${wind.unit}`;

  DOMElements.humidity.textContent = `${Math.round(weatherData.humidity)}%`;

  const feelsLike = getTemp(weatherData.feelsLike);
  DOMElements.feelsLike.textContent = `${feelsLike.value}${feelsLike.unit}`;

  const visibility = getDistance(weatherData.visibility);
  DOMElements.visibility.textContent = `${visibility.value} ${visibility.unit}`;

  const uvIconPath = await getUvIconPath(weatherData.uvindex);
  DOMElements.uvCard.innerHTML = `
    <h4 class="detail-title">UV Index</h4>
    <img src="${uvIconPath}" alt="UV Index icon">
    <p class="detail-value">${weatherData.uvindex}</p>
  `;

  const moonDetails = await getMoonPhaseDetails(weatherData.moonPhase);
  DOMElements.moonPhaseCard.innerHTML = `
    <h4 class="detail-title">Moon Phase</h4>
    <img src="${moonDetails.icon}" alt="${moonDetails.name} icon">
    <p class="detail-value">${moonDetails.name}</p>
  `;
}

async function renderHourlyForecast(weatherData) {
  DOMElements.hourlyContainer.innerHTML = "";
  const currentHour = new Date().getHours();
  const nextHours = weatherData.hourlyForecast.slice(
    currentHour,
    currentHour + 24,
  );

  const iconPromises = nextHours.map((hour) => getWeatherIcon(hour.icon));
  const iconHTMLs = await Promise.all(iconPromises);

  let finalHTML = "";
  nextHours.forEach((hour, index) => {
    const temp = getTemp(hour.temp);
    finalHTML += `
    <div class="hourly-item">
      <span>${hour.time.slice(0, 2) == currentHour ? "Now" : formatTime(hour.time)}</span>
      ${iconHTMLs[index]}
      <span>${temp.value}<span class="unit">${temp.unit}</span></span> <!-- Wrap unit in a span -->
    </div>
  `;
  });

  DOMElements.hourlyContainer.innerHTML = finalHTML;
}

async function renderDailyForecast(weatherData) {
  DOMElements.dailyContainer.innerHTML = "";
  const nextDays = weatherData.dailyForecast.slice(0, 15);

  const iconPromises = nextDays.map((day) => getWeatherIcon(day.icon));
  const iconHTMLs = await Promise.all(iconPromises);

  let finalHTML = "";
  nextDays.forEach((day, index) => {
    const maxTemp = getTemp(day.tempMax);
    const minTemp = getTemp(day.tempMin);
    finalHTML += `
    <div class="daily-item">
      <span class="daily-item-day">${getDayName(day.date)}</span>
      <div class="daily-item-condition">
          ${iconHTMLs[index]} <span>${day.conditions}</span>
      </div>
      <span class="daily-item-temp">${maxTemp.value}<span class="unit">${maxTemp.unit}</span>/${minTemp.value}<span class="unit">${minTemp.unit}</span></span> <!-- Wrap unit in a span -->
    </div>
  `;
  });

  DOMElements.dailyContainer.innerHTML = finalHTML;
}

export default async function updateUI(weatherData) {
  if (!weatherData) return;

  DOMElements.unitToggleBtn.textContent =
    getUnitSystem() === "imperial" ? "F" : "C";

  await renderCurrentWeather(weatherData);
  renderWeatherDetails(weatherData);
  await renderHourlyForecast(weatherData);
  await renderDailyForecast(weatherData);
}
