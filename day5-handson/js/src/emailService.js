/**
 * emailService.js
 *
 * Thin wrapper around a real email-sending transport
 * (e.g. SendGrid, AWS SES, SMTP).
 *
 * In tests this entire module is MOCKED so we can
 * verify that our business logic calls it correctly —
 * without ever sending a real email.
 */

/**
 * Sends a plain-text email.
 *
 * @param {string} to      - Recipient address
 * @param {string} subject - Email subject line
 * @param {string} body    - Plain-text email body
 * @returns {Promise<void>}
 */
async function send(to, subject, body) {
  // In production this would call a real email API.
  // For the exercise we just log.
  console.log(`[EmailService] Sending to ${to}: "${subject}"`);
}

module.exports = { send };
