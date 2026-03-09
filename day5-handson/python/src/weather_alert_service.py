# weather_alert_service.py
#
# This is the UNIT UNDER TEST for Task 1.
#
# Business rules:
#   - temperature >= 35  →  alert level "HIGH"
#   - temperature <= 10  →  alert level "LOW"
#   - anything in between  →  alert level "NORMAL"
#
# This module IMPORTS weather_service. That import is the
# dependency we will STUB in tests using @patch so no real
# HTTP call ever happens during unit testing.

from src.weather_service import get_temperature


def get_alert(city: str) -> str:
    """
    Returns an alert level string for the given city
    based on the current temperature.

    Returns: 'HIGH', 'LOW', or 'NORMAL'
    """
    # Ask the dependency for the current temperature.
    # In tests this call will be STUBBED via @patch.
    temp = get_temperature(city)

    # Apply the business rules — pure logic, easy to test.
    if temp >= 35:
        return "HIGH"
    if temp <= 10:
        return "LOW"
    return "NORMAL"
