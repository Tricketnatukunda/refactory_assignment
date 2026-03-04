# receives a number and return either fizz, buzz, fizzbuzz or the number
def fizzbuzz(n):
   if n % 3 == 0 and n % 5 == 0:
       return "FizzBuzz"
   elif n % 3 == 0:
       return "Fizz"
   elif n % 5 == 0:
       return "Buzz"
   else:
    return n





# line unimaginable
x = fizzbuzz(45)
