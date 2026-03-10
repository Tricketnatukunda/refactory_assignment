const { add, subtract, multiply, divide } = require('./calculator')


test('add returns the sum of two numbers ', () => {
  expect(add(1, 2)).toBe(3)
})
