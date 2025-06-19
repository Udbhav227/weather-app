import fetchWeatherData from './modules/api';
import Weather from './modules/weather'

async function fetchData(input) {
  try {
    const rawData = await fetchWeatherData(input);
    const weather = new Weather(rawData);

    console.log('Weather object created:', weather);
  } catch (error) {
    console.error('Failed to get weather', error);
  }
}

fetchData('Delhi');
