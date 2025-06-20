// 'imperial' = Fahrenheit, mph, miles | 'metric' = Celsius, km/h, km
let currentUnitSystem = "imperial";

/**
 * Toggles the current unit system between imperial and metric.
 */
export function toggleUnits() {
  currentUnitSystem = currentUnitSystem === "imperial" ? "metric" : "imperial";
}

/**
 * Returns the name of the current unit system.
 * @returns {string}
 */
export function getUnitSystem() {
  return currentUnitSystem;
}

/**
 * Converts a temperature value from Fahrenheit based on the current system.
 * @param {number} tempF - The temperature in Fahrenheit.
 * @returns {{value: number, unit: string}}
 */
export function getTemp(tempF) {
  if (currentUnitSystem === "imperial") {
    return { value: Math.round(tempF), unit: "°F" };
  }
  const tempC = ((tempF - 32) * 5) / 9;
  return { value: Math.round(tempC), unit: "°C" };
}

/**
 * Converts a speed value from MPH based on the current system.
 * @param {number} speedMph - The speed in miles per hour.
 * @returns {{value: number, unit: string}}
 */
export function getSpeed(speedMph) {
  if (currentUnitSystem === "imperial") {
    return { value: Math.round(speedMph), unit: "mph" };
  }
  const speedKph = speedMph * 1.60934;
  return { value: Math.round(speedKph), unit: "km/h" };
}

/**
 * Converts a distance value from miles based on the current system.
 * @param {number} distMiles - The distance in miles.
 * @returns {{value: number, unit: string}}
 */
export function getDistance(distMiles) {
  if (currentUnitSystem === "imperial") {
    return { value: Math.round(distMiles), unit: "miles" };
  }
  const distKm = distMiles * 1.60934;
  return { value: Math.round(distKm), unit: "km" };
}