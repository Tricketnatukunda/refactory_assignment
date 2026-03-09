/**
 * userService.js
 *
 * This is the UNIT UNDER TEST for Task 3: Fakes.
 *
 * UserService orchestrates user management operations.
 * It depends on a repository to persist data.
 *
 * The repository is injected via the constructor — this is
 * DEPENDENCY INJECTION. In production we pass a RealUserRepository.
 * In tests we pass a FakeUserRepository.
 *
 * Business rules:
 *   - Users must have an id, name, and email.
 *   - Email must contain "@".
 *   - Duplicate ids are rejected.
 *   - listAll() returns users sorted by name (A → Z).
 *   - removeUser() returns false if the user didn't exist.
 */

class UserService {
  /**
   * @param {object} repository - Any object with save / findById /
   *                              findAll / deleteById methods.
   *                              Injected so tests can pass a Fake.
   */
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Registers a new user after validating the input.
   *
   * @param {{ id: string, name: string, email: string }} user
   * @returns {Promise<{ success: boolean, reason?: string }>}
   */
  async registerUser(user) {
    // Validate required fields
    if (!user?.id || !user?.name || !user?.email) {
      return { success: false, reason: 'Missing required fields: id, name, email' };
    }

    // Validate email format
    if (!user.email.includes('@')) {
      return { success: false, reason: 'Invalid email address' };
    }

    // Check for duplicate
    const existing = await this.repository.findById(user.id);
    if (existing) {
      return { success: false, reason: `User with id "${user.id}" already exists` };
    }

    await this.repository.save(user);
    return { success: true };
  }

  /**
   * Retrieves a single user by id.
   *
   * @param {string} id
   * @returns {Promise<object|null>} The user, or null if not found.
   */
  async getUser(id) {
    return this.repository.findById(id);
  }

  /**
   * Returns all users sorted alphabetically by name.
   *
   * @returns {Promise<object[]>}
   */
  async listAll() {
    const users = await this.repository.findAll();
    return users.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Removes a user. Returns false if the user didn't exist.
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async removeUser(id) {
    return this.repository.deleteById(id);
  }
}

module.exports = { UserService };
