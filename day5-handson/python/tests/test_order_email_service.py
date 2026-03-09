# test_order_email_service.py  —  Task 2: Mocks
#
# GOAL: verify that our order service sends the correct email
#       to the correct recipient — and sends nothing when the
#       order is invalid.
#
# TECHNIQUE: MOCK
#   Unlike a stub (which only controls return values), a mock
#   lets us assert HOW a dependency was called:
#     - Was it called at all?
#     - How many times?
#     - With exactly which arguments?
#
#   assert_called_once_with()  — exact argument matching
#   assert_called_once()       — called exactly once (any args)
#   assert_not_called()        — verify silence
#   call_args                  — inspect arguments after the fact
#
#   We patch at the module level so the entire email_service
#   module is replaced — every function inside it becomes
#   a MagicMock automatically.

import pytest
from unittest.mock import patch, MagicMock, call, ANY
from src.order_email_service import place_order


# ─── Happy path: email IS sent ────────────────────────────────

@patch('src.order_email_service.email_service')
def test_sends_confirmation_email_on_valid_order(mock_email):
    # ACT
    place_order(user='alice@test.com', item='Python Book')

    # ASSERT: email.send was called exactly once
    mock_email.send.assert_called_once()


@patch('src.order_email_service.email_service')
def test_sends_email_to_correct_recipient(mock_email):
    place_order(user='alice@test.com', item='Python Book')

    # ASSERT: first argument must be the user's email address
    args, _ = mock_email.send.call_args
    assert args[0] == 'alice@test.com'


@patch('src.order_email_service.email_service')
def test_includes_item_name_in_email_subject(mock_email):
    place_order(user='bob@test.com', item='Clean Code')

    # ASSERT: second argument (subject) must mention the item
    args, _ = mock_email.send.call_args
    subject = args[1]
    assert 'Clean Code' in subject


@patch('src.order_email_service.email_service')
def test_returns_success_true_for_valid_order(mock_email):
    result = place_order(user='alice@test.com', item='Book')

    assert result == {'success': True}


# ─── Sad path: email is NOT sent ──────────────────────────────

@patch('src.order_email_service.email_service')
def test_does_not_send_email_when_user_is_none(mock_email):
    place_order(user=None, item='Book')

    # ASSERT: the mock must not have been called at all
    mock_email.send.assert_not_called()


@patch('src.order_email_service.email_service')
def test_does_not_send_email_when_item_is_none(mock_email):
    place_order(user='alice@test.com', item=None)

    mock_email.send.assert_not_called()


@patch('src.order_email_service.email_service')
def test_returns_success_false_with_reason_for_invalid_order(mock_email):
    result = place_order(user=None, item=None)

    assert result['success'] is False
    assert 'reason' in result
