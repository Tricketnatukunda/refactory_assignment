# data_processing_service.py
#
# This is the UNIT UNDER TEST for Task 4 (Bonus): Spies.
#
# Business rules:
#   - process_value() accepts a number and doubles it.
#   - If the input is not a number, logs a warning and returns None.
#   - If the input is negative, logs a warning and processes
#     the absolute value instead.
#
# In tests we SPY on logger.warn to verify it is called with
# the right message — without replacing the real logger.
#
# A SPY is right here because:
#   1. We want to ASSERT that logger.warn was called.
#   2. We still want the real logger to run (real logs appear
#      during debugging), not just a silent mock replacement.

from src import logger


def process_value(value) -> float | None:
    """
    Processes a numeric value by doubling it.
    Logs a warning and returns None for invalid input.

    Args:
        value: Expected to be a positive number.

    Returns:
        The doubled value, or None if input is invalid.
    """
    # Guard: non-numeric input
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        logger.warn(f"Invalid input received: {value}")
        return None

    # Guard: negative input — process abs value but warn caller
    if value < 0:
        logger.warn(f"Negative value received: {value}. Using absolute value.")
        value = abs(value)

    return value * 2
