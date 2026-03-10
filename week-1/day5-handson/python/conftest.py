# conftest.py — pytest configuration
# Adds the project root to sys.path so 'src.*' imports work.

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
