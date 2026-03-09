/**
 * weatherAlertService.test.js  —  Task 1: Stubs
 *
 * GOAL: test the alert business logic without making
 *       any real HTTP calls.
 *
 * TECHNIQUE: STUB
 *   jest.mock() replaces the entire weatherService module
 *   with an auto-mocked version. We then use
 *   .mockResolvedValue() to hard-code what getTemperature()
 *   returns for each individual test.
 *
 * KEY RULE: we only stub what we don't own (the HTTP call).
 *           We never stub getAlert() — that is the unit
 *           we are testing.
 */

const { getAlert } = require('../src/weatherAlertService');

// Replace the real weatherService module with a Jest mock.
// After this line, every function in weatherService is
// automatically replaced with jest.fn() — a do-nothing stub.
jest.mock('../src/weatherService');

// Bring in the mocked version so we can control its return values.
const weatherService = require('../src/weatherService');

// ─── Reset stubs between tests ────────────────────────────────
// This prevents a stub set in one test from leaking into the next.
beforeEach(() => {
  jest.clearAllMocks();
});

// ─── HIGH alert ───────────────────────────────────────────────

test('returns HIGH alert when temperature is exactly 35°C (boundary)', async () => {
  // ARRANGE: stub the dependency to return 35
  weatherService.getTemperature.mockResolvedValue(35);

  // ACT: run the unit under test
  const alert = await getAlert('London');

  // ASSERT: check the business-rule output
  expect(alert).toBe('HIGH');
});

test('returns HIGH alert when temperature is above 35°C', async () => {
  weatherService.getTemperature.mockResolvedValue(42);

  const alert = await getAlert('Dubai');

  expect(alert).toBe('HIGH');
});

// ─── LOW alert ────────────────────────────────────────────────

test('returns LOW alert when temperature is exactly 10°C (boundary)', async () => {
  // ARRANGE: force the stub to return the boundary value
  weatherService.getTemperature.mockResolvedValue(10);

  const alert = await getAlert('Oslo');

  expect(alert).toBe('LOW');
});

test('returns LOW alert when temperature is below 10°C', async () => {
  weatherService.getTemperature.mockResolvedValue(-5);

  const alert = await getAlert('Reykjavik');

  expect(alert).toBe('LOW');
});

// ─── NORMAL alert ─────────────────────────────────────────────

test('returns NORMAL alert for temperature between 10°C and 35°C', async () => {
  weatherService.getTemperature.mockResolvedValue(22);

  const alert = await getAlert('Paris');

  expect(alert).toBe('NORMAL');
});

// ─── Stub simulating an error condition ───────────────────────
// This is something you CANNOT do with a real API on demand.

test('propagates errors thrown by the weather service', async () => {
  // ARRANGE: make the stub throw — simulates network down / API error
  weatherService.getTemperature.mockRejectedValue(
    new Error('Network timeout')
  );

  // ACT + ASSERT: the error should bubble up to the caller
  await expect(getAlert('Anywhere')).rejects.toThrow('Network timeout');
});
