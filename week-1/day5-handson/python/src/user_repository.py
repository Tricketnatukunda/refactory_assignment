# user_repository.py
#
# Defines the contract (interface) that any user repository
# must satisfy — real DB implementation or Fake in-memory version.
#
# In production you inject a RealUserRepository that talks
# to a real database. In tests you inject a FakeUserRepository
# that stores users in a plain Python dict — no DB required.
#
# This is DEPENDENCY INJECTION: the service doesn't care which
# repository it receives, as long as it satisfies the interface.


class RealUserRepository:
    """
    Production repository — would normally call a real database.
    Not used in tests — only here to show the production shape.
    """

    def save(self, user: dict) -> None:
        # db.execute("INSERT INTO users ...", user)
        raise NotImplementedError("RealUserRepository: not implemented in this exercise")

    def find_by_id(self, user_id: str) -> dict | None:
        # return db.execute("SELECT * FROM users WHERE id = ?", [user_id])
        raise NotImplementedError("RealUserRepository: not implemented in this exercise")

    def find_all(self) -> list[dict]:
        # return db.execute("SELECT * FROM users")
        raise NotImplementedError("RealUserRepository: not implemented in this exercise")

    def delete_by_id(self, user_id: str) -> bool:
        # db.execute("DELETE FROM users WHERE id = ?", [user_id])
        raise NotImplementedError("RealUserRepository: not implemented in this exercise")


class FakeUserRepository:
    """
    FAKE repository — stores users in a plain Python dict.

    This has REAL logic (save actually saves, find actually finds)
    but uses in-memory storage instead of a database. It is faster
    and simpler than the real thing, making it perfect for unit
    tests that need to verify multiple operations in sequence.

    A Fake differs from a Stub:
      - Stub: always returns the same hard-coded value.
      - Fake: has working logic — what you save, you can retrieve.
    """

    def __init__(self):
        # Simple in-memory store: id → user dict
        self._store: dict[str, dict] = {}

    def save(self, user: dict) -> None:
        if not user or 'id' not in user:
            raise ValueError("User must have an 'id' field")
        # Store a copy so external mutations don't affect stored data
        self._store[user['id']] = dict(user)

    def find_by_id(self, user_id: str) -> dict | None:
        return self._store.get(user_id)

    def find_all(self) -> list[dict]:
        return list(self._store.values())

    def delete_by_id(self, user_id: str) -> bool:
        if user_id in self._store:
            del self._store[user_id]
            return True
        return False  # nothing was deleted
