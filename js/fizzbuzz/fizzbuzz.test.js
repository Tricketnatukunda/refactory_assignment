const fizzbuzz = require('./fizzbuzz')

test('returns 1 when number is 1', () => {
    expect(fizzbuzz(1)).toBe(1)
})

test('returns 2 when number is 2', () => {
    expect(fizzbuzz(2)).toBe(2)
})

test('returns Fizz when number is 3', () => {
    expect(fizzbuzz(3)).toBe('Fizz')
})

test('returns Buzz when number is 5', () => {
    expect(fizzbuzz(5)).toBe('Buzz')
})  

test('returns Buzz when number is 15', () => {
    expect(fizzbuzz(15)).toBe('FizzBuzz')
}) 
