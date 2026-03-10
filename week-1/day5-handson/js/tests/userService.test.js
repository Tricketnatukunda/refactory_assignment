/**
 * userService.test.js  —  Task 3: Fakes
 *
 * GOAL: test multiple repository operations in a single test
 *       without any real database — using a FakeUserRepository.
 *
 * TECHNIQUE: FAKE
 *   A Fake has real working logic (save actually saves, find
 *   actually finds) but uses in-memory storage instead of a DB.
 *
 *   Why not use Stubs here?
 *   Stubs only return hard-coded values. If we stub findById,
 *   it always returns the same thing regardless of what we
 *   previously saved — we can't test the save→find flow.
 *
 *   Why not use Mocks?
 *   Mocks become unwieldy when you need to chain multiple calls.
 *   A Fake lets the code flow naturally.
 *
 * DEPENDENCY INJECTION in action:
 *   new UserService(new FakeUserRepository())
 *   The service doesn't know — or care — whether the
 *   repository is real or fake.
 */

const { UserService }        = require('../src/userService');
const { FakeUserRepository } = require('../src/userRepository');

// ─── Test fixtures ────────────────────────────────────────────
const ALICE = { id: 'u1', name: 'Alice', email: 'alice@test.com' };
const BOB   = { id: 'u2', name: 'Bob',   email: 'bob@test.com'   };
const CAROL = { id: 'u3', name: 'Carol', email: 'carol@test.com' };

// ─── Fresh fake + service before each test ────────────────────
// A new FakeUserRepository is created for each test so no data
// leaks between tests — the same guarantee a real DB would give
// if we rolled back transactions after each test.
let service;
beforeEach(() => {
  service = new UserService(new FakeUserRepository());
});

// ─── registerUser ─────────────────────────────────────────────

test('registers a valid user successfully', async () => {
  const result = await service.registerUser(ALICE);

  expect(result.success).toBe(true);
});

test('can retrieve a user after registering (save → find chain)', async () => {
  // This test exercises TWO repository operations in sequence.
  // A stub could not do this — only a Fake can.
  await service.registerUser(ALICE);

  const found = await service.getUser('u1');

  expect(found).toMatchObject({ name: 'Alice', email: 'alice@test.com' });
});

test('rejects a user with a missing email', async () => {
  const result = await service.registerUser({ id: 'u9', name: 'Ghost' });

  expect(result.success).toBe(false);
  expect(result.reason).toMatch(/missing/i);
});

test('rejects a user with an invalid email (no @ symbol)', async () => {
  const result = await service.registerUser({
    id: 'u9', name: 'Ghost', email: 'not-an-email'
  });

  expect(result.success).toBe(false);
  expect(result.reason).toMatch(/invalid email/i);
});

test('rejects a duplicate user id', async () => {
  await service.registerUser(ALICE);

  // Attempt to register a second user with the same id
  const result = await service.registerUser({ ...ALICE, name: 'Alice2' });

  expect(result.success).toBe(false);
  expect(result.reason).toMatch(/already exists/i);
});

// ─── listAll ──────────────────────────────────────────────────

test('listAll returns all registered users', async () => {
  await service.registerUser(ALICE);
  await service.registerUser(BOB);

  const users = await service.listAll();

  expect(users).toHaveLength(2);
});

test('listAll returns users sorted alphabetically by name', async () => {
  // Register in reverse alphabetical order
  await service.registerUser(CAROL);
  await service.registerUser(ALICE);
  await service.registerUser(BOB);

  const users = await service.listAll();

  // Expect A → B → C regardless of insertion order
  expect(users.map(u => u.name)).toEqual(['Alice', 'Bob', 'Carol']);
});

test('listAll returns empty array when no users registered', async () => {
  const users = await service.listAll();

  expect(users).toEqual([]);
});

// ─── removeUser ───────────────────────────────────────────────

test('removes a user that exists (save → delete → find chain)', async () => {
  await service.registerUser(ALICE);

  await service.removeUser('u1');

  // The Fake lets us verify the delete actually worked
  const found = await service.getUser('u1');
  expect(found).toBeNull();
});

test('returns false when removing a user that does not exist', async () => {
  const result = await service.removeUser('no-such-id');

  expect(result).toBe(false);
});
