export function numberToLetters(num) {
  const division = Math.floor(num / 26)
  const reminder = Math.floor(num % 26)
  const char = String.fromCharCode(reminder + 97).toUpperCase()
  return division - 1 >= 0 ? numberToLetters(division - 1) + char : char
}

export function lettersToNumber(str) {
  let result = 0
  for (let i = 0; i < str.length; i++) {
    // Convert the letter to a 1-based index (A=1, B=2, ..., Z=26, AA=27, AB=28, ...)
    let value = str.charCodeAt(i) - 'A'.charCodeAt(0) + 1
    // Treat the string as a base-26 number
    result = result * 26 + value
  }
  return result
}

export function increaseAlphabet(str) {
  const lastCharCode = str.charCodeAt(str.length - 1)

  // If the last character is 'Z', add 'A' and carry to the previous character
  if (lastCharCode === 'Z'.charCodeAt(0)) {
    let carry = 1
    let result = ''

    for (let i = str.length - 1; i >= 0; i--) {
      const charCode = str.charCodeAt(i) + carry

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
    return str.slice(0, -1) + nextChar
  }
}

export function extractLetters(str) {
  // Using a regular expression to match the letters at the beginning of the string
  const matches = str.match(/^[A-Za-z]+/)

  // If there are matches, return the first match; otherwise, return an empty string
  return matches ? matches[0] : ''
}

export function extractDigits(str) {
  return str.replace(/^\D+/g, '')
}

export function extractCellIds(str) {
  const cellPattern = /[A-Z]+\d+/g
  const cellIds = str.match(cellPattern) || []
  return cellIds
  // const operators = str
  //   .split(/[A-Z]+\d+/)
  //   .filter(Boolean)
  //   .map((op) => op.trim())

  // return {
  //   cellsId,
  //   operators
  // }
}
