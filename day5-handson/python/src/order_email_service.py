# order_email_service.py
#
# This is the UNIT UNDER TEST for Task 2: Mocks.
#
# Business rules:
#   - A valid order (user email + item) triggers a confirmation email.
#   - An invalid order (None user or None item) must NOT send any email.
#   - The email subject must mention the item name.
#   - The email must be sent to the user's email address.
#
# email_service is the DEPENDENCY we will MOCK in tests.
# Mocking lets us verify the exact arguments our code passes
# to the email sender — not just that it "ran".

from src import email_service


def place_order(user: str | None, item: str | None) -> dict:
    """
    Places an order and sends a confirmation email if valid.

    Args:
        user: The customer's email address, or None for invalid orders.
        item: The name of the item being ordered, or None for invalid.

    Returns:
        dict with 'success' bool and optional 'reason' string.
    """
    # Guard: reject invalid orders without sending any email.
    if not user or not item:
        return {'success': False, 'reason': 'Invalid order: missing user or item'}

    # Send a confirmation email to the customer.
    # The mock in tests will intercept this call and let us
    # assert that it was called with the correct arguments.
    email_service.send(
        user,
        f"Order confirmation: {item}",
        f"Thank you for ordering {item}. Your order is being processed."
    )

    return {'success': True}
