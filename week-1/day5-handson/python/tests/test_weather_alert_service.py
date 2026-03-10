# test_weather_alert_service.py  —  Task 1: Stubs
#
# GOAL: test the alert business logic without making
#       any real HTTP calls.
#
# TECHNIQUE: STUB using @patch
#   unittest.mock.patch temporarily replaces get_temperature
#   with a MagicMock. We then set mock.return_value to
#   control exactly what "the API returns" in each test.
#
#   @patch target must be the path where the function is USED,
#   not where it is DEFINED. Since weather_alert_service.py
#   imports get_temperature into its own namespace, we patch:
#       'src.weather_alert_service.get_temperature'
#   NOT:
#       'src.weather_service.get_temperature'
#
# KEY RULE: only stub what you don't own (the HTTP call).
#           Never stub get_alert() — that is the unit we test.

import pytest
from unittest.mock import patch
from src.weather_alert_service import get_alert


# ─── HIGH alert ───────────────────────────────────────────────

def test_returns_high_alert_at_exactly_35_degrees_boundary():
    # @patch replaces get_temperature for this test only.
    # The 'mock_get' argument receives the MagicMock object.
    with patch('src.weather_alert_service.get_temperature') as mock_get:
        # ARRANGE: stub the dependency to return boundary value
        mock_get.return_value = 35

        # ACT
        alert = get_alert('London')

        # ASSERT
        assert alert == 'HIGH'


def test_returns_high_alert_above_35_degrees():
    with patch('src.weather_alert_service.get_temperature') as mock_get:
        mock_get.return_value = 42

        alert = get_alert('Dubai')

        assert alert == 'HIGH'


# ─── LOW alert ────────────────────────────────────────────────

def test_returns_low_alert_at_exactly_10_degrees_boundary():
    with patch('src.weather_alert_service.get_temperature') as mock_get:
        # ARRANGE: stub to return the lower boundary
        mock_get.return_value = 10

        alert = get_alert('Oslo')

        assert alert == 'LOW'


def test_returns_low_alert_below_10_degrees():
    with patch('src.weather_alert_service.get_temperature') as mock_get:
        mock_get.return_value = -5

        alert = get_alert('Reykjavik')

        assert alert == 'LOW'


# ─── NORMAL alert ─────────────────────────────────────────────

def test_returns_normal_alert_between_10_and_35_degrees():
    with patch('src.weather_alert_service.get_temperature') as mock_get:
        mock_get.return_value = 22

        alert = get_alert('Paris')

        assert alert == 'NORMAL'


# ─── Stub simulating an error condition ───────────────────────
# This is something you CANNOT do with a real API on demand.

def test_propagates_errors_from_weather_service():
    with patch('src.weather_alert_service.get_temperature') as mock_get:
        # ARRANGE: make the stub raise — simulates network failure
        mock_get.side_effect = ConnectionError('Network timeout')

        # ACT + ASSERT: the exception must bubble up
        with pytest.raises(ConnectionError, match='Network timeout'):
            get_alert('Anywhere')


# ─── Alternative: using @patch decorator syntax ───────────────
# Both the context manager (with patch(...)) and the decorator
# (@patch(...)) are equivalent. Use whichever reads more clearly.

@patch('src.weather_alert_service.get_temperature')
def test_returns_normal_alert_decorator_style(mock_get):
    # The mock is injected as the last argument to the test function.
    mock_get.return_value = 20

    alert = get_alert('Berlin')

    assert alert == 'NORMAL'
