/**
 * logger.js
 *
 * A simple application logger.
 * In tests we SPY on this to verify warning calls
 * without replacing its real behaviour.
 */

const logger = {
  /**
   * Logs an informational message.
   * @param {string} message
   */
  info(message) {
    console.log(`[INFO]  ${message}`);
  },

  /**
   * Logs a warning message.
   * @param {string} message
   */
  warn(message) {
    console.warn(`[WARN]  ${message}`);
  },

  /**
   * Logs an error message.
   * @param {string} message
   */
  error(message) {
    console.error(`[ERROR] ${message}`);
  },
};

module.exports = logger;
