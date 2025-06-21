import fetchWeatherData from "./modules/api";
import Weather from "./modules/weather";
import updateUI from "./modules/dom";
import { toggleUnits } from "./modules/units";

import {
  showFullPageSpinner,
  hideFullPageSpinner,
  showSearchSpinner,
  hideSearchSpinner,
  hideContent,
  showContent,
} from "./modules/spinner";

import "../styles/main.css";
import "../styles/reset.css";
import "../styles/variables.css";

import localData from "../bbsr.json";

let currentWeather = null;

async function fetchAndDisplayWeather(city) {
  try {
    showSearchSpinner();
    hideContent();
    console.log(`Fetching weather for ${city}...`);
    const rawData = await fetchWeatherData(city);
    currentWeather = new Weather(rawData);
    console.log("Weather object created:", currentWeather);
    await new Promise((resolve) => setTimeout(resolve, 50));
    updateUI(currentWeather);
    await new Promise((resolve) => setTimeout(resolve, 100));
    showContent();
  } catch (error) {
    console.error("Failed to get weather", error);
    alert("Could not fetch weather data. Please try another city.");
    showContent();
  } finally {
    hideSearchSpinner();
  }
}

function displayLocalData() {
  try {
    currentWeather = new Weather(localData);
    updateUI(currentWeather);
  } catch (error) {
    throw new Error("Failed to process local weather data", error);
  }
}

async function fetchCityFromCoordinates(lat, lon) {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await response.json();
    return data.city || data.locality || null;
  } catch (error) {
    console.error("Failed to fetch city from coordinates:", error);
    return null;
  }
}

function initializeEventListeners() {
  const searchForm = document.getElementById("weather-search-form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityInput = document.getElementById("city-input");
    const city = cityInput.value.trim();
    if (city) {
      fetchAndDisplayWeather(city);
    }
    cityInput.value = "";
  });

  const mobileSearchBtn = document.getElementById("mobile-search-btn");
  mobileSearchBtn.addEventListener("click", () => {
    const city = prompt("Search city");
    if (city) {
      fetchAndDisplayWeather(city);
    }
  });

  const unitToggle = document.getElementById("unit-toggle-btn");
  unitToggle.addEventListener("click", () => {
    toggleUnits();
    if (currentWeather) {
      updateUI(currentWeather);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  showFullPageSpinner();

  try {
    hideContent();
    fetchAndDisplayWeather("New York");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User's location: Latitude ${latitude}, Longitude ${longitude}`);
          const city = await fetchCityFromCoordinates(latitude, longitude);
          await fetchAndDisplayWeather(city || `${latitude},${longitude}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not fetch your location. Showing default city weather.");
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    showContent();
  } catch (error) {
    console.error(error);
  } finally {
    hideFullPageSpinner();
  }

  initializeEventListeners();
});

toggleUnits();
