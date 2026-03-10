# email_service.py
#
# Thin wrapper around a real email transport
# (e.g. SendGrid, Amazon SES, SMTP).
#
# In tests this module is MOCKED so we can verify that our
# business logic calls it correctly — without ever sending
# a real email.


def send(to: str, subject: str, body: str) -> None:
    """
    Sends a plain-text email.

    Args:
        to:      Recipient address
        subject: Email subject line
        body:    Plain-text email body
    """
    # In production this would call a real email API.
    print(f"[EmailService] Sending to {to}: \"{subject}\"")
