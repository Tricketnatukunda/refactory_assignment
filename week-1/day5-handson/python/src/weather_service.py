# weather_service.py
#
# Thin wrapper around a real HTTP weather API.
# In production this makes a real network call.
# In tests, we STUB this function using @patch so we can
# control the temperature value without hitting any real API.
#
# Dependency boundary: this module represents "external
# infrastructure". It should always be patched in unit tests.

import time


def get_temperature(city: str) -> float:
    """
    Fetches the current temperature for a given city.
    Returns a float in degrees Celsius.

    In a real app this would call:
        response = requests.get(f"https://api.weather.com/temp?city={city}")
        return response.json()["temperature"]

    For the exercise we simulate a slow network call.
    """
    # Simulated network delay
    time.sleep(0.1)
    return 20.0  # placeholder — always 20°C
