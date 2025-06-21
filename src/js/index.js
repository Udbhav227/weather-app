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
    displayLocalData();
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
