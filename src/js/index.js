import fetchWeatherData from "./modules/api";
import Weather from "./modules/weather";
import updateUI from "./modules/dom";
import { toggleUnits } from "./modules/units";

import "../styles/main.css";
import "../styles/reset.css";
import "../styles/variables.css";

import localData from "../bbsr.json";

let currentWeather = null;

async function fetchAndDisplayWeather(city) {
  try {
    // TODO: Add a loading state indicator here
    console.log(`Fetching weather for ${city}...`);
    const rawData = await fetchWeatherData(city);
    currentWeather = new Weather(rawData); // Store the weather object

    console.log("Weather object created:", currentWeather);
    updateUI(currentWeather);
    // TODO: Hide loading state indicator
  } catch (error) {
    console.error("Failed to get weather", error);
    alert("Could not fetch weather data. Please try another city.");
    // TODO: Display error message in the UI
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

document.addEventListener("DOMContentLoaded", () => {
  displayLocalData();
  initializeEventListeners();
});

toggleUnits();