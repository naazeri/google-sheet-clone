export function increaseAlphabet(input) {
  const lastCharCode = input.charCodeAt(input.length - 1)

  // If the last character is 'Z', add 'A' and carry to the previous character
  if (lastCharCode === 'Z'.charCodeAt(0)) {
    let carry = 1
    let result = ''

    for (let i = input.length - 1; i >= 0; i--) {
      const charCode = input.charCodeAt(i) + carry

      if (charCode > 'Z'.charCodeAt(0)) {
        carry = 1
        result = 'A' + result
      } else {
        carry = 0
        result = String.fromCharCode(charCode) + result
      }
    }

    // If there is still a carry after the loop, prepend 'A'
    if (carry === 1) {
      result = 'A' + result
    }

    return result
  } else {
    // If the last character is not 'Z', replace it with the next character
    const nextChar = String.fromCharCode(lastCharCode + 1)
    return input.slice(0, -1) + nextChar
  }
}

export function extractLetters(input) {
  // Using a regular expression to match the letters at the beginning of the string
  const matches = input.match(/^[A-Za-z]+/)

  // If there are matches, return the first match; otherwise, return an empty string
  return matches ? matches[0] : ''
}

// function parseFormula(formula) {
//   const cellPattern = /[A-Z]+\d+/g
//   const cellsId = formula.match(cellPattern) || []

//   const operators = formula
//     .split(/[A-Z]+\d+/)
//     .filter(Boolean)
//     .map((op) => op.trim())

//   return {
//     cellsId,
//     operators
//   }
// }
