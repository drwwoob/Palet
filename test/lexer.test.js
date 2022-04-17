import assert from "assert/strict"
import tokenize from "../src/lexer.js"
import { Token } from "../src/core.js"

// incase we need error cases
// const errorCases = [
//   ["malformed number", "2.f", /Error: Line 1, Column 3: Digit expected/],
// ]

// Test case uses astral characters to test columns are correct
const allTokens = `red1, red2, red3, red4, red5`

//there was an error of can't delete space, our goal is to eliminate that
const expectedTokens = [
  new Token(0,"red1"),
  new Token(1,"red2"),
  new Token(2,"red3"),
  new Token(3,"red4"),
  new Token(4,"red5"),
]

describe("The lexer", () => {
  it(`correctly tokenizes the big test case`, () => {
    assert.deepEqual(expectedTokens, [...tokenize(allTokens)])
  })
  // for (const [scenario, source, errorMessagePattern] of errorCases) {
  //   it(`throws on ${scenario}`, () => {
  //     assert.throws(() => [...tokenize(source)], errorMessagePattern)
  //   })
  // }
})
