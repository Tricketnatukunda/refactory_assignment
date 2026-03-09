# test_data_processing_service.py  —  Task 4 (Bonus): Spies
#
# GOAL: verify that process_value() calls logger.warn with the
#       correct message for invalid inputs — while keeping the
#       real logger working so logs still appear during debugging.
#
# TECHNIQUE: SPY using patch(wraps=...)
#   patch(wraps=original_fn) creates a MagicMock that DELEGATES
#   every call to the original function. The spy:
#     - records all calls (so we can assert on them)
#     - still executes the real function (so real logs appear)
#
#   Compare to a plain Mock (@patch without wraps):
#     - Mock:  replaces the function entirely, silences it.
#     - Spy:   wraps the function, records calls, keeps behaviour.
#
#   Use a Spy when you care about OBSERVING calls but also want
#   the real side effect to happen.
#
# IMPORTANT: patch() as a context manager (with patch(...))
#   automatically restores the original after the with-block.
#   No manual cleanup needed, unlike Jest's spy.mockRestore().

from unittest.mock import patch, call
from src.data_processing_service import process_value
from src import logger


# ─── Happy path — no warnings ─────────────────────────────────

def test_doubles_a_positive_number_without_any_warning():
    with patch.object(logger, 'warn', wraps=logger.warn) as spy:
        # ACT
        result = process_value(5)

        # ASSERT: correct output
        assert result == 10

        # SPY ASSERTION: warn was never called for valid input
        spy.assert_not_called()


def test_handles_zero_correctly_without_warning():
    with patch.object(logger, 'warn', wraps=logger.warn) as spy:
        result = process_value(0)

        assert result == 0
        spy.assert_not_called()


def test_handles_float_input_correctly():
    with patch.object(logger, 'warn', wraps=logger.warn) as spy:
        result = process_value(2.5)

        assert result == 5.0
        spy.assert_not_called()


# ─── Invalid input — warning IS expected ──────────────────────

def test_returns_none_and_logs_warning_for_string_input():
    with patch.object(logger, 'warn', wraps=logger.warn) as spy:
        result = process_value("hello")

        # ASSERT: None returned for invalid input
        assert result is None

        # SPY ASSERTION: warn was called exactly once
        spy.assert_called_once()

        # SPY ASSERTION: warn was called with the right message
        args, _ = spy.call_args
        assert 'Invalid input received' in args[0]


def test_returns_none_and_logs_warning_for_none_input():
    with patch.object(logger, 'warn', wraps=logger.warn) as spy:
        result = process_value(None)

        assert result is None
        spy.assert_called_once()
        args, _ = spy.call_args
        assert 'Invalid input received' in args[0]


def test_returns_none_and_logs_warning_for_boolean_input():
    # Booleans are a subclass of int in Python — our guard
    # explicitly rejects them with isinstance(..., bool)
    with patch.object(logger, 'warn', wraps=logger.warn) as spy:
        result = process_value(True)

        assert result is None
        spy.assert_called_once()


# ─── Negative input — warning + abs value ─────────────────────

def test_processes_absolute_value_and_warns_for_negative_input():
    with patch.object(logger, 'warn', wraps=logger.warn) as spy:
        result = process_value(-4)

        # Still produces a result: abs(-4) * 2 = 8
        assert result == 8

        # SPY ASSERTION: a warning was logged about the negative value
        spy.assert_called_once()
        args, _ = spy.call_args
        assert 'Negative value received' in args[0]


# ─── Alternative: @patch decorator with wraps= ────────────────
# Decorator style is cleaner when you only spy on one thing.

@patch.object(logger, 'warn', wraps=logger.warn)
def test_no_warning_for_large_positive_number(spy):
    # The spy is injected as the last argument (same as @patch)
    result = process_value(1000)

    assert result == 2000
    spy.assert_not_called()
