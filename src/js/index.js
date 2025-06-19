import fetchWeatherData from './modules/api';
import Weather from './modules/weather';
import updateUI from './modules/dom'; 
import '../styles/main.css';
import '../styles/reset.css'
import '../styles/variables.css';

import localData from '../Bejing.json'; 

// --- State ---
let currentUnit = 'C'; // or 'F'

// --- Functions ---
async function fetchAndDisplayWeather(city) {
  try {
    // TODO: Add a loading state indicator here
    console.log(`Fetching weather for ${city}...`);
    const rawData = await fetchWeatherData(city);
    const weather = new Weather(rawData);
    
    console.log('Weather object created:', weather);
    updateUI(weather);
    // TODO: Hide loading state indicator
  } catch (error) {
    console.error('Failed to get weather', error);
    alert('Could not fetch weather data. Please try another city.');
    // TODO: Display error message in the UI
  }
}

function displayLocalData() {
    try {
        const weather = new Weather(localData);
        console.log('Local weather object created:', weather);
        updateUI(weather);
    } catch (error) {
        console.error('Failed to process local weather data', error);
    }
}


// --- Event Listeners ---
function initializeEventListeners() {
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cityInput = document.getElementById('city-input');
        const city = cityInput.value.trim();
        if (city) {
            fetchAndDisplayWeather(city);
        }
        cityInput.value = ''; // Clear input field
    });

    // TODO: Add event listener for the C/F toggle button
    const unitToggle = document.getElementById('unit-toggle-btn');
    unitToggle.addEventListener('click', () => {
        // Here you would implement the logic in units.js and re-render the UI
        console.log("Unit toggle clicked. Feature to be implemented.");
    });
}


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // initializeEventListeners();
    displayLocalData();
    // fetchAndDisplayWeather('Bhubaneswar')
});