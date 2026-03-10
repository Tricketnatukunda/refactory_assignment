/**
 * dataProcessingService.test.js  —  Task 4 (Bonus): Spies
 *
 * GOAL: verify that processValue() calls logger.warn with the
 *       correct message for invalid inputs — while keeping the
 *       real logger working so logs still appear during debugging.
 *
 * TECHNIQUE: SPY
 *   jest.spyOn(object, 'methodName') wraps the real method.
 *   The original behaviour is PRESERVED unless you explicitly
 *   override it with .mockImplementation() or .mockReturnValue().
 *
 *   Compare to a Mock:
 *     - Mock: replaces the function entirely, asserts on calls.
 *     - Spy:  wraps the real function, records calls, keeps behaviour.
 *
 *   Use a Spy when you care about observing calls but also want
 *   the real side effect to happen (e.g. real logging in test output).
 *
 * IMPORTANT: always call spy.mockRestore() after each test
 *   to unwrap the spy and restore the original function.
 *   Without this, the spy from one test contaminates the next.
 */

const logger          = require('../src/logger');
const { processValue } = require('../src/dataProcessingService');

// ─── Spy lifecycle ────────────────────────────────────────────
let warnSpy;

beforeEach(() => {
  // Create a spy on logger.warn.
  // The real logger.warn still runs — the spy just records calls.
  warnSpy = jest.spyOn(logger, 'warn');
});

afterEach(() => {
  // Remove the spy wrapper and restore the original logger.warn.
  // This is critical — without it, spies accumulate across tests.
  warnSpy.mockRestore();
});

// ─── Happy path — no warnings ─────────────────────────────────

test('doubles a positive number without logging any warning', () => {
  const result = processValue(5);

  expect(result).toBe(10);
  // SPY ASSERTION: warn was never called for valid input
  expect(warnSpy).not.toHaveBeenCalled();
});

test('handles zero correctly without warning', () => {
  const result = processValue(0);

  expect(result).toBe(0);
  expect(warnSpy).not.toHaveBeenCalled();
});

// ─── Invalid input — warning IS expected ──────────────────────

test('returns null and logs a warning for a string input', () => {
  const result = processValue('hello');

  expect(result).toBeNull();

  // SPY ASSERTION: verify the warning was logged exactly once
  expect(warnSpy).toHaveBeenCalledTimes(1);

  // SPY ASSERTION: verify the exact warning message
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringContaining('Invalid input received')
  );
});

test('returns null and logs a warning for null input', () => {
  processValue(null);

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringContaining('Invalid input received')
  );
});

test('returns null and logs a warning for NaN input', () => {
  processValue(NaN);

  expect(warnSpy).toHaveBeenCalledTimes(1);
});

// ─── Negative input — warning + abs value ─────────────────────

test('processes absolute value and warns when input is negative', () => {
  const result = processValue(-4);

  // Still produces a result (abs(-4) * 2 = 8)
  expect(result).toBe(8);

  // SPY ASSERTION: a warning was logged about the negative value
  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringContaining('Negative value received')
  );
});
