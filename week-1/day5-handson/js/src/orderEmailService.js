/**
 * orderEmailService.js
 *
 * This is the UNIT UNDER TEST for Task 2: Mocks.
 *
 * Business rules:
 *   - A valid order (user with email + at least one item)
 *     must trigger a confirmation email to the user.
 *   - An invalid order (null user, missing email, no items)
 *     must NOT send any email.
 *   - The email subject must mention the item name.
 *   - The email must be sent to the user's email address.
 *
 * The emailService is the DEPENDENCY we will MOCK in tests.
 * Mocking lets us verify the exact arguments our code
 * passes to the email sender — not just that it "ran".
 */

const emailService = require('./emailService');

/**
 * Places an order and sends a confirmation email if valid.
 *
 * @param {{ user: string|null, item: string|null }} order
 * @returns {Promise<{ success: boolean, reason?: string }>}
 */
async function placeOrder({ user, item }) {
  // Guard: reject invalid orders without sending any email.
  if (!user || !item) {
    return { success: false, reason: 'Invalid order: missing user or item' };
  }

  // Send a confirmation email to the customer.
  // The mock in tests will intercept this call and let us
  // assert that it was called with the correct arguments.
  await emailService.send(
    user,
    `Order confirmation: ${item}`,
    `Thank you for ordering ${item}. Your order is being processed.`
  );

  return { success: true };
}

module.exports = { placeOrder };
