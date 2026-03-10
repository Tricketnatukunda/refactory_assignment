# Day 5 — Working with Dependencies: Hands-On Exercise

## Setup

### JavaScript
```bash
cd js
npm install
npm test
```

### Python
```bash
cd python
pip install pytest
pytest tests/ -v
```

---

## File Structure

```
js/
  src/
    weatherService.js          # External dependency (HTTP API) — STUB this
    weatherAlertService.js     # Task 1: Unit under test
    emailService.js            # External dependency (email transport) — MOCK this
    orderEmailService.js       # Task 2: Unit under test
    userRepository.js          # FakeUserRepository lives here — Task 3
    userService.js             # Task 3: Unit under test
    logger.js                  # Real logger — SPY on this
    dataProcessingService.js   # Task 4 (Bonus): Unit under test
  tests/
    weatherAlertService.test.js
    orderEmailService.test.js
    userService.test.js
    dataProcessingService.test.js

python/
  src/
    weather_service.py
    weather_alert_service.py
    email_service.py
    order_email_service.py
    user_repository.py
    user_service.py
    logger.py
    data_processing_service.py
  tests/
    test_weather_alert_service.py
    test_order_email_service.py
    test_user_service.py
    test_data_processing_service.py
```

---

## Tasks

| # | Service | Technique | What to verify |
|---|---------|-----------|----------------|
| 1 | WeatherAlertService | **Stub** | Alert level is HIGH / LOW / NORMAL based on temperature — no real HTTP call |
| 2 | OrderEmailService | **Mock** | Email is sent with correct recipient + subject; NOT sent for invalid orders |
| 3 | UserService | **Fake** | Save → find → list → delete chain using FakeUserRepository |
| ★ | DataProcessingService | **Spy** | logger.warn called with right message; real logger still works |

---

## Key Reminders

- **Only mock what you don't own** — never mock the unit under test itself
- **Reset mocks between tests** — use `beforeEach` / `@pytest.fixture`
- **Stubs** control return values; **Mocks** verify interactions; **Fakes** have real logic; **Spies** observe without replacing
