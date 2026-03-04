from fizzbuzz import fizzbuzz as cynthia


def test_1_returns_1():
    assert cynthia(1) == 1

def test_2_returns_2():
    assert cynthia(2) == 2

def test_3_returns_fizz():
    assert cynthia(3) == "Fizz"

def test_5_returns_buzz():
    assert cynthia(5) == "Buzz"

def test_15_returns_fizzbuzz():
    assert cynthia(15) == "FizzBuzz"
    
def test_16_returns_16():
    assert cynthia(16) == 16
    
def test_18_returns_fizz():
    assert cynthia(18) == "Fizz"

def test_45_returns_fizzbuzz():
    assert cynthia(45) == "FizzBuzz"

def test_100_returns_buzz():
    assert cynthia(100) == "Buzz"
    
    
# check that the function doesn't allow parameter that are not numbers
