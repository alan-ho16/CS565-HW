/** Exercise 01 - Coins **/

// Add your function here
const calculateChange = function calculateChange(money) {
  // Checking validity
  let cleanInput = money;
  if (typeof cleanInput === 'string') {
    cleanInput = cleanInput.replaceAll('$', '').replaceAll(',', '').trim();
  }

  // Parse explicitly to a number
  const numericAmount = Number(cleanInput);

  // Check for NaN or invalid numeric conversion
  if (Number.isNaN(numericAmount) || cleanInput === '') {
    return 'Invalid input: Please enter a valid number';
  }

  // Checking validity range
  if (numericAmount <= 0) {
    return 'Amount must be greater than $0.00';
  }
  if (numericAmount > 100) {
    return 'Amount exceeds the maximum limit of $100.00';
  }

  // Convert dollars to cents to avoid floating-point errors
  let totalCents = Math.round(numericAmount * 100);

  const units = [
    { name: 'Dollar', cents: 100 },
    { name: 'Quarter', cents: 25 },
    { name: 'Dime', cents: 10 },
    { name: 'Nickel', cents: 5 },
    { name: 'Penny', plural: 'Pennies', cents: 1 },
  ];

  const parts = [];
  // use forEach to loop through each unit and their change
  units.forEach(({ name, plural, cents }) => {
    const count = Math.floor(totalCents / cents);
    totalCents %= cents;

    // If there is change for a type of coin, adjust the plurality
    // and push to parts list
    if (count > 0) {
      const labelName = count === 1 ? name : plural || `${name}s`;
      parts.push(`${count} ${labelName}`);
    }
  });
  // If there is only one type of change, return it
  if (parts.length === 1) {
    return parts[0];
  }
  // If there are multiple units, use join and pop
  const lastPart = parts.pop();
  return `${parts.join(', ')} and ${lastPart}`;
};
// Sample test cases
console.log(calculateChange(4.62));
// $4.62 ==> 4 dollars, 2 quarters, 1 dime, 2 pennies
console.log(calculateChange(0.16));
// $0.16 ==> 1 dime, 1 nickel, 1 penny
console.log(calculateChange(150.11));
// $150.11 ==> Error: the number is too large

// Add additional test cases here

console.log(calculateChange(-0.1));
console.log(calculateChange(-10.5));
console.log(calculateChange(10.5));
console.log(calculateChange(11.26));

console.log(calculateChange(0));
console.log(calculateChange(100));
console.log(calculateChange(100.01));
console.log(calculateChange(-0));
console.log(calculateChange(-0.01));
console.log(calculateChange(1.006));

console.log(calculateChange(99.99));
console.log(calculateChange(-1.006));
console.log(calculateChange(-1.01));

console.log(calculateChange('10.25'));
console.log(calculateChange(10, 0));
console.log(calculateChange(1.006));
console.log(calculateChange('$10.27'));
console.log(calculateChange('-10.89'));
console.log(calculateChange('10,,,,,0'));
console.log(calculateChange(10, 5));
console.log(calculateChange('$$$$10,,,,,0'));
