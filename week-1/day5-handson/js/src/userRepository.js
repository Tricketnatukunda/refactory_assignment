/**
 * userRepository.js
 *
 * Defines the INTERFACE (contract) that any user repository
 * must satisfy — real DB or fake in-memory version.
 *
 * In production you would inject a RealUserRepository
 * that talks to PostgreSQL / MongoDB / etc.
 * In tests you inject a FakeUserRepository that stores
 * users in a plain JavaScript Map — no DB required.
 *
 * This pattern is called "Dependency Injection" and it is
 * what makes the Fake pattern possible.
 */

/**
 * REAL repository — would normally call a database.
 * Not used in tests — only here to show the production shape.
 */
class RealUserRepository {
  async save(user) {
    // db.query('INSERT INTO users ...', user);
    throw new Error('RealUserRepository: not implemented in this exercise');
  }

  async findById(id) {
    // return db.query('SELECT * FROM users WHERE id = ?', [id]);
    throw new Error('RealUserRepository: not implemented in this exercise');
  }

  async findAll() {
    // return db.query('SELECT * FROM users');
    throw new Error('RealUserRepository: not implemented in this exercise');
  }

  async deleteById(id) {
    // db.query('DELETE FROM users WHERE id = ?', [id]);
    throw new Error('RealUserRepository: not implemented in this exercise');
  }
}

/**
 * FAKE repository — stores users in memory.
 *
 * This has REAL logic (save actually saves, find actually finds)
 * but zero infrastructure. It is faster and simpler than the
 * real thing, which makes it perfect for unit tests that need
 * to verify multiple operations in sequence.
 *
 * A Fake is different from a Stub (which only hard-codes return
 * values) because it carries working business logic.
 */
class FakeUserRepository {
  constructor() {
    // Simple in-memory store: id → user object
    this.store = new Map();
  }

  async save(user) {
    if (!user || !user.id) throw new Error('User must have an id');
    this.store.set(user.id, { ...user }); // store a copy
  }

  async findById(id) {
    return this.store.get(id) ?? null;
  }

  async findAll() {
    return Array.from(this.store.values());
  }

  async deleteById(id) {
    const existed = this.store.has(id);
    this.store.delete(id);
    return existed; // true if something was actually deleted
  }
}

module.exports = { RealUserRepository, FakeUserRepository };
