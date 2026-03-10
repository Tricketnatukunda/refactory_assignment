from account import receive_payment, update_transaction, make_payment


def make_account(balance=0):
    return {"balance": balance, "transactions": []}


# --- receive_payment ---

def test_receive_payment_increases_balance():
    account = make_account(100)
    result = receive_payment(account, 50)
    assert result == 150

def test_receive_payment_updates_account_balance():
    account = make_account(0)
    receive_payment(account, 200)
    assert account["balance"] == 200

def test_receive_payment_zero_amount():
    account = make_account(100)
    result = receive_payment(account, 0)
    assert result == 100

def test_receive_payment_records_transaction():
    account = make_account(0)
    receive_payment(account, 150)
    assert {"type": "receipt", "amount": 150} in account["transactions"]


# --- update_transaction ---

def test_update_transaction_appends_amount():
    account = make_account()
    update_transaction(account, 75, "receipt")
    assert {"type": "receipt", "amount": 75} in account["transactions"]

def test_update_transaction_returns_transactions_list():
    account = make_account()
    result = update_transaction(account, 30, "payout")
    assert result == [{"type": "payout", "amount": 30}]

def test_update_transaction_multiple_entries():
    account = make_account()
    update_transaction(account, 10, "receipt")
    update_transaction(account, 20, "payout")
    assert account["transactions"] == [
        {"type": "receipt", "amount": 10},
        {"type": "payout", "amount": 20},
    ]


# --- make_payment ---

def test_make_payment_decreases_balance():
    account = make_account(500)
    result = make_payment(account, 200)
    assert result == 300

def test_make_payment_updates_account_balance():
    account = make_account(100)
    make_payment(account, 40)
    assert account["balance"] == 60

def test_make_payment_raises_when_insufficient_funds():
    account = make_account(50)
    try:
        make_payment(account, 100)
        assert False, "Expected ValueError"
    except ValueError as e:
        assert str(e) == "Insufficient funds"

def test_make_payment_exact_balance():
    account = make_account(100)
    result = make_payment(account, 100)
    assert result == 0

def test_make_payment_records_transaction():
    account = make_account(500)
    make_payment(account, 200)
    assert {"type": "payout", "amount": 200} in account["transactions"]


# --- string amount validation ---

def test_receive_payment_rejects_string_amount():
    account = make_account(0)
    try:
        receive_payment(account, "100")
        assert False, "Expected TypeError"
    except TypeError as e:
        assert str(e) == "Amount must be a number"

def test_update_transaction_rejects_string_amount():
    account = make_account()
    try:
        update_transaction(account, "50", "receipt")
        assert False, "Expected TypeError"
    except TypeError as e:
        assert str(e) == "Amount must be a number"

def test_make_payment_rejects_string_amount():
    account = make_account(500)
    try:
        make_payment(account, "200")
        assert False, "Expected TypeError"
    except TypeError as e:
        assert str(e) == "Amount must be a number"
