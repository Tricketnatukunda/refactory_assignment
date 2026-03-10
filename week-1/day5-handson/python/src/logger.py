# logger.py
#
# A simple application logger.
# In tests we SPY on this using patch(wraps=) to verify
# warning calls without replacing its real behaviour.


def info(message: str) -> None:
    """Logs an informational message."""
    print(f"[INFO]  {message}")


def warn(message: str) -> None:
    """Logs a warning message."""
    print(f"[WARN]  {message}")


def error(message: str) -> None:
    """Logs an error message."""
    print(f"[ERROR] {message}")
