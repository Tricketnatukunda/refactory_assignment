/**
 * weatherAlertService.js
 *
 * This is the UNIT UNDER TEST for Task 1.
 *
 * Business rules:
 *   - temperature >= 35  →  alert level "HIGH"
 *   - temperature <= 10  →  alert level "LOW"
 *   - anything in between  →  alert level "NORMAL"
 *
 * Notice that this module IMPORTS weatherService.
 * That import is the dependency we will STUB in tests —
 * we never want a real HTTP call during a unit test.
 */

const { getTemperature } = require('./weatherService');

/**
 * Returns an alert level string for the given city
 * based on the current temperature.
 *
 * @param {string} city - The city to check
 * @returns {Promise<'HIGH' | 'LOW' | 'NORMAL'>}
 */
async function getAlert(city) {
  // Ask the dependency for the current temperature.
  // In tests this call will be STUBBED.
  const temp = await getTemperature(city);

  // Apply the business rules — pure logic, easy to test.
  if (temp >= 35) return 'HIGH';
  if (temp <= 10) return 'LOW';
  return 'NORMAL';
}

module.exports = { getAlert };
