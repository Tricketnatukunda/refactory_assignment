/**
 * orderEmailService.test.js  —  Task 2: Mocks
 *
 * GOAL: verify that our order service sends the correct email
 *       to the correct recipient — and sends nothing when the
 *       order is invalid.
 *
 * TECHNIQUE: MOCK
 *   Unlike a stub (which only controls return values), a mock
 *   lets us make assertions about HOW a dependency was called:
 *     - Was it called at all?
 *     - How many times?
 *     - With exactly which arguments?
 *
 *   toHaveBeenCalledWith()    — exact argument matching
 *   expect.stringContaining() — partial string match
 *   not.toHaveBeenCalled()    — verify silence
 */

const { placeOrder } = require('../src/orderEmailService');

// Replace the real email module with a Jest mock.
// emailService.send is now a jest.fn() — it records every call.
jest.mock('../src/emailService');
const emailService = require('../src/emailService');

// ─── Reset the mock between every test ───────────────────────
// Without this, call counts from one test bleed into the next.
beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Happy path: email IS sent ────────────────────────────────

test('sends a confirmation email to the user on a valid order', async () => {
  // ACT
  await placeOrder({ user: 'alice@test.com', item: 'JavaScript Book' });

  // ASSERT: email.send was called exactly once
  expect(emailService.send).toHaveBeenCalledTimes(1);
});

test('sends the email to the correct recipient', async () => {
  await placeOrder({ user: 'alice@test.com', item: 'JavaScript Book' });

  // ASSERT: first argument must be the user's email address
  expect(emailService.send).toHaveBeenCalledWith(
    'alice@test.com',      // to
    expect.any(String),    // subject — checked separately below
    expect.any(String)     // body
  );
});

test('includes the item name in the email subject', async () => {
  await placeOrder({ user: 'bob@test.com', item: 'Python Cookbook' });

  // ASSERT: second argument (subject) must mention the item
  expect(emailService.send).toHaveBeenCalledWith(
    expect.any(String),
    expect.stringContaining('Python Cookbook'), // partial subject match
    expect.any(String)
  );
});

test('returns success:true when order is valid', async () => {
  const result = await placeOrder({ user: 'alice@test.com', item: 'Book' });

  expect(result).toEqual({ success: true });
});

// ─── Sad path: email is NOT sent ──────────────────────────────

test('does NOT send an email when user is null', async () => {
  await placeOrder({ user: null, item: 'Book' });

  // ASSERT: the mock must not have been called at all
  expect(emailService.send).not.toHaveBeenCalled();
});

test('does NOT send an email when item is null', async () => {
  await placeOrder({ user: 'alice@test.com', item: null });

  expect(emailService.send).not.toHaveBeenCalled();
});

test('returns success:false with a reason when order is invalid', async () => {
  const result = await placeOrder({ user: null, item: null });

  expect(result.success).toBe(false);
  expect(result.reason).toBeDefined();
});
