import {
  VISUAL_CROSSING_API_KEY,
  VISUAL_CROSSING_BASE_URL,
} from "../utils/constants";

export default async function fetchWeatherData(location) {
  if (!location) {
    throw new Error("Location cannot be empty. Please provide a city.");
  }

  const url = new URL(
    `${VISUAL_CROSSING_BASE_URL}${encodeURIComponent(location.trim())}`,
  );
  url.searchParams.append("key", VISUAL_CROSSING_API_KEY);

  console.log("Constructed API URL:", url.toString()); // For debugging

  try {
    const response = await fetch(url.toString(), { mode: "cors" });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Failed to fetch weather data: ${response.status} - ${errorData}`,
      );
    }

    const data = await response.json();
    console.log(`Raw API response data: `, data); // For debugging

    return data;
  } catch (error) {
    console.error(`An error occurred during api call:`, error);
    throw error;
  }
}
