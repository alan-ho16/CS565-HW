/** Exercise 01 - Fizzbuzz

Problem: 

Given an integer n, return a string array answer (1-indexed) where:

answer[i] === "FizzBuzz" if i is divisible by 3 and 5.
answer[i] === "Fizz" if i is divisible by 3.
answer[i] === "Buzz" if i is divisible by 5.
answer[i] === i (as a string) if none of the above conditions are true.
 

Example 1:

Input: n = 3
Output: ["1","2","Fizz"]

Example 2:

Input: n = 5
Output: ["1","2","Fizz","4","Buzz"]

Example 3:

Input: n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]

**/
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askNumber() {
  rl.question("Enter a number: ", (input) => {
    let validNumber = Number(input);

    if (
      input === null ||
      input.trim() === "" ||
      isNaN(validNumber) ||
      validNumber < 1
    ) {
      console.log("Please enter a valid number 1 or above.");
      askNumber();
    } else {
      console.log("Valid number entered:", validNumber);
      rl.close();

      const result = get_fizz_buzz(validNumber);
      console.log(JSON.stringify(result));
    }
  });
}
function get_fizz_buzz(number) {
  const fizz_buzz_array = [];
  for (let i = 1; i <= number; i++) {
    if (!(i % 3) && !(i % 5)) {
      fizz_buzz_array.push("FizzBuzz");
    } else if (!(i % 3)) {
      fizz_buzz_array.push("Fizz");
    } else if (!(i % 5)) {
      fizz_buzz_array.push("Buzz");
    } else {
      fizz_buzz_array.push(i.toString());
    }
  }
  return fizz_buzz_array;
}

askNumber();
