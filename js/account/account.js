function update_transaction(account, amount, type) {
    if (typeof amount !== 'number') {
        throw new TypeError('Amount must be a number')
    }
    account.transactions.push({ type, amount })
    return account.transactions
}

function receive_payment(account, amount) {
    if (typeof amount !== 'number') {
        throw new TypeError('Amount must be a number')
    }
    account.balance += amount
    update_transaction(account, amount, 'receipt')
    return account.balance
}

function make_payment(account, amount) {
    if (typeof amount !== 'number') {
        throw new TypeError('Amount must be a number')
    }
    if (account.balance < amount) {
        throw new Error('Insufficient funds')
    }
    account.balance -= amount
    update_transaction(account, amount, 'payout')
    return account.balance
}



module.exports = { receive_payment, update_transaction, make_payment }
