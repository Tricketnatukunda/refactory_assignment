const { receive_payment, update_transaction, make_payment } = require('./account')

function make_account(balance = 0) {
    return { balance, transactions: [] }
}


// --- receive_payment ---

test('receive_payment increases balance', () => {
    const account = make_account(100)
    expect(receive_payment(account, 50)).toBe(150)
})

test('receive_payment updates account balance', () => {
    const account = make_account(0)
    receive_payment(account, 200)
    expect(account.balance).toBe(200)
})

test('receive_payment with zero amount', () => {
    const account = make_account(100)
    expect(receive_payment(account, 0)).toBe(100)
})

test('receive_payment records transaction as receipt', () => {
    const account = make_account(0)
    receive_payment(account, 150)
    expect(account.transactions).toContainEqual({ type: 'receipt', amount: 150 })
})


// --- update_transaction ---

test('update_transaction appends amount with type', () => {
    const account = make_account()
    update_transaction(account, 75, 'receipt')
    expect(account.transactions).toContainEqual({ type: 'receipt', amount: 75 })
})

test('update_transaction returns transactions list', () => {
    const account = make_account()
    const result = update_transaction(account, 30, 'payout')
    expect(result).toEqual([{ type: 'payout', amount: 30 }])
})

test('update_transaction records multiple entries', () => {
    const account = make_account()
    update_transaction(account, 10, 'receipt')
    update_transaction(account, 20, 'payout')
    expect(account.transactions).toEqual([
        { type: 'receipt', amount: 10 },
        { type: 'payout', amount: 20 },
    ])
})


// --- make_payment ---

test('make_payment decreases balance', () => {
    const account = make_account(500)
    expect(make_payment(account, 200)).toBe(300)
})

test('make_payment updates account balance', () => {
    const account = make_account(100)
    make_payment(account, 40)
    expect(account.balance).toBe(60)
})

test('make_payment throws when insufficient funds', () => {
    const account = make_account(50)
    expect(() => make_payment(account, 100)).toThrow('Insufficient funds')
})

test('make_payment with exact balance', () => {
    const account = make_account(100)
    expect(make_payment(account, 100)).toBe(0)
})

test('make_payment records transaction as payout', () => {
    const account = make_account(500)
    make_payment(account, 200)
    expect(account.transactions).toContainEqual({ type: 'payout', amount: 200 })
})


// --- string amount validation ---

test('receive_payment rejects string amount', () => {
    const account = make_account(0)
    expect(() => receive_payment(account, '100')).toThrow(TypeError)
    expect(() => receive_payment(account, '100')).toThrow('Amount must be a number')
})

test('update_transaction rejects string amount', () => {
    const account = make_account()
    expect(() => update_transaction(account, '50', 'receipt')).toThrow(TypeError)
    expect(() => update_transaction(account, '50', 'receipt')).toThrow('Amount must be a number')
})

test('make_payment rejects string amount', () => {
    const account = make_account(500)
    expect(() => make_payment(account, '200')).toThrow(TypeError)
    expect(() => make_payment(account, '200')).toThrow('Amount must be a number')
})
