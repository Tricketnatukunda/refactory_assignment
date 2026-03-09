/**
 * weatherService.js
 *
 * A thin wrapper around a real HTTP weather API.
 * In production this makes a real network call.
 * In tests, we STUB this function so we can control
 * the temperature value without hitting any real API.
 *
 * Dependency boundary: everything outside this module
 * is considered "real infrastructure" and should be
 * mocked or stubbed in unit tests.
 */

/**
 * Fetches the current temperature for a given city.
 * Returns a number in degrees Celsius.
 *
 * @param {string} city - The city name (e.g. "London")
 * @returns {Promise<number>} Temperature in °C
 */
async function getTemperature(city) {
  // In a real app this would be:
  //   const res = await fetch(`https://api.weather.com/temp?city=${city}`);
  //   const data = await res.json();
  //   return data.temperature;
  //
  // For the exercise we simulate a real call with a delay.
  await new Promise(resolve => setTimeout(resolve, 100));
  return 20; // placeholder — always 20°C
}

module.exports = { getTemperature };
