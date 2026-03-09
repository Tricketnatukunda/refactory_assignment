# test_user_service.py  —  Task 3: Fakes
#
# GOAL: test multiple repository operations in a single test
#       without any real database — using a FakeUserRepository.
#
# TECHNIQUE: FAKE
#   A Fake has real working logic (save actually saves, find
#   actually finds) but uses in-memory storage instead of a DB.
#
#   Why not use Stubs here?
#   Stubs only return hard-coded values. A stub for find_by_id
#   always returns the same thing regardless of what was saved —
#   we can't test the save → find chain with a stub.
#
#   Why not use Mocks?
#   Mocks become unwieldy when you need to chain multiple calls.
#   Fakes let the code flow naturally through real logic.
#
# DEPENDENCY INJECTION in action:
#   UserService(FakeUserRepository())
#   The service doesn't know — or care — whether the
#   repository is real or fake.

import pytest
from src.user_service import UserService
from src.user_repository import FakeUserRepository


# ─── Test fixtures ────────────────────────────────────────────

ALICE = {'id': 'u1', 'name': 'Alice', 'email': 'alice@test.com'}
BOB   = {'id': 'u2', 'name': 'Bob',   'email': 'bob@test.com'}
CAROL = {'id': 'u3', 'name': 'Carol', 'email': 'carol@test.com'}


@pytest.fixture
def service():
    """
    Provides a fresh UserService backed by a FakeUserRepository
    for every test. Data never leaks between tests.
    """
    return UserService(FakeUserRepository())


# ─── register_user ────────────────────────────────────────────

def test_registers_a_valid_user_successfully(service):
    result = service.register_user(ALICE)

    assert result['success'] is True


def test_can_retrieve_user_after_registering(service):
    # This test exercises TWO operations in sequence.
    # A stub could not do this — only a Fake can.
    service.register_user(ALICE)

    found = service.get_user('u1')

    assert found['name'] == 'Alice'
    assert found['email'] == 'alice@test.com'


def test_rejects_user_with_missing_email(service):
    result = service.register_user({'id': 'u9', 'name': 'Ghost'})

    assert result['success'] is False
    assert 'missing' in result['reason'].lower()


def test_rejects_user_with_invalid_email(service):
    result = service.register_user(
        {'id': 'u9', 'name': 'Ghost', 'email': 'not-an-email'}
    )

    assert result['success'] is False
    assert 'invalid email' in result['reason'].lower()


def test_rejects_duplicate_user_id(service):
    service.register_user(ALICE)

    # Attempt to register a second user with the same id
    result = service.register_user({**ALICE, 'name': 'Alice2'})

    assert result['success'] is False
    assert 'already exists' in result['reason'].lower()


# ─── list_all ─────────────────────────────────────────────────

def test_list_all_returns_all_registered_users(service):
    service.register_user(ALICE)
    service.register_user(BOB)

    users = service.list_all()

    assert len(users) == 2


def test_list_all_returns_users_sorted_alphabetically(service):
    # Register in reverse alphabetical order
    service.register_user(CAROL)
    service.register_user(ALICE)
    service.register_user(BOB)

    users = service.list_all()

    # Expect A → B → C regardless of insertion order
    assert [u['name'] for u in users] == ['Alice', 'Bob', 'Carol']


def test_list_all_returns_empty_list_when_no_users(service):
    users = service.list_all()

    assert users == []


# ─── remove_user ──────────────────────────────────────────────

def test_removes_a_user_that_exists(service):
    service.register_user(ALICE)

    service.remove_user('u1')

    # The Fake lets us verify the delete actually worked
    found = service.get_user('u1')
    assert found is None


def test_returns_false_when_removing_nonexistent_user(service):
    result = service.remove_user('no-such-id')

    assert result is False
