def update_transaction(account, amount, type):
    if not isinstance(amount, (int, float)):
        raise TypeError("Amount must be a number")
    account["transactions"].append({"type": type, "amount": amount})
    return account["transactions"]


def receive_payment(account, amount):
    if not isinstance(amount, (int, float)):
        raise TypeError("Amount must be a number")
    account["balance"] += amount
    update_transaction(account, amount, "receipt")
    return account["balance"]


def make_payment(account, amount):
    if not isinstance(amount, (int, float)):
        raise TypeError("Amount must be a number")
    if account["balance"] < amount:
        raise ValueError("Insufficient funds")
    account["balance"] -= amount
    update_transaction(account, amount, "payout")
    return account["balance"]
