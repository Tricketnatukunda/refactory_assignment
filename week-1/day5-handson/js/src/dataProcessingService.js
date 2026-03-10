/**
 * dataProcessingService.js
 *
 * This is the UNIT UNDER TEST for Task 4 (Bonus): Spies.
 *
 * Business rules:
 *   - processValue() accepts a number and doubles it.
 *   - If the input is not a number, it logs a warning
 *     and returns null.
 *   - If the input is negative, it logs a warning
 *     and processes the absolute value instead.
 *
 * In tests we SPY on logger.warn to verify that it is
 * called with the right message — without replacing
 * the real logger behaviour.
 *
 * A SPY is the right choice here because:
 *   1. We want to ASSERT that logger.warn was called.
 *   2. We still want the real logger to run (so real logs
 *      appear during debugging), not just a silent mock.
 */

const logger = require('./logger');

/**
 * Processes a numeric value by doubling it.
 * Logs a warning and returns null for invalid input.
 *
 * @param {*} value - Expected to be a positive number
 * @returns {number|null}
 */
function processValue(value) {
  // Guard: non-numeric input
  if (typeof value !== 'number' || isNaN(value)) {
    logger.warn(`Invalid input received: ${value}`);
    return null;
  }

  // Guard: negative input — process abs value but warn
  if (value < 0) {
    logger.warn(`Negative value received: ${value}. Using absolute value.`);
    value = Math.abs(value);
  }

  return value * 2;
}

module.exports = { processValue };
