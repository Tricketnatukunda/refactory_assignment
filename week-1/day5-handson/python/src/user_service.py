# user_service.py
#
# This is the UNIT UNDER TEST for Task 3: Fakes.
#
# UserService orchestrates user management operations.
# It depends on a repository to persist data.
#
# The repository is injected via __init__ — DEPENDENCY INJECTION.
# In production: UserService(RealUserRepository())
# In tests:      UserService(FakeUserRepository())
#
# Business rules:
#   - Users must have an id, name, and email.
#   - Email must contain "@".
#   - Duplicate ids are rejected.
#   - list_all() returns users sorted by name (A → Z).
#   - remove_user() returns False if the user didn't exist.


class UserService:
    """
    Manages user registration, lookup, listing, and removal.

    Args:
        repository: Any object implementing save, find_by_id,
                    find_all, and delete_by_id.
                    Injected so tests can pass a FakeUserRepository.
    """

    def __init__(self, repository):
        self.repository = repository

    def register_user(self, user: dict) -> dict:
        """
        Registers a new user after validating the input.

        Args:
            user: dict with keys 'id', 'name', 'email'

        Returns:
            dict with 'success' bool and optional 'reason' string.
        """
        # Validate required fields
        if not user or not all(k in user for k in ('id', 'name', 'email')):
            return {'success': False, 'reason': 'Missing required fields: id, name, email'}

        # Validate email format
        if '@' not in user['email']:
            return {'success': False, 'reason': 'Invalid email address'}

        # Check for duplicate id
        existing = self.repository.find_by_id(user['id'])
        if existing:
            return {'success': False, 'reason': f"User with id \"{user['id']}\" already exists"}

        self.repository.save(user)
        return {'success': True}

    def get_user(self, user_id: str) -> dict | None:
        """
        Retrieves a single user by id.

        Returns the user dict, or None if not found.
        """
        return self.repository.find_by_id(user_id)

    def list_all(self) -> list[dict]:
        """
        Returns all users sorted alphabetically by name (A → Z).
        """
        users = self.repository.find_all()
        return sorted(users, key=lambda u: u['name'])

    def remove_user(self, user_id: str) -> bool:
        """
        Removes a user. Returns False if the user didn't exist.
        """
        return self.repository.delete_by_id(user_id)
