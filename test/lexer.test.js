import assert from "assert/strict"
import tokenize from "../src/lexer.js"
import { Color } from "../src/core.js";

// incase we need error cases
// const errorCases = [
//   ["malformed number", "2.f", /Error: Line 1, Column 3: Digit expected/],
// ]

// Test case uses astral characters to test columns are correct
const allTokens = `red1, red2, red3, red4, red5`

//there was an error of can't delete space, our goal is to eliminate that
const expectedTokens = [
  new Color("red1"),
  new Color("red2"),
  new Color("red3"),
  new Color("red4"),
  new Color("red5"),
  new Color("END"),
]

describe("The lexer", () => {
  it(`correctly tokenizes a color string with space`, () => {
    assert.deepEqual(expectedTokens, [...tokenize(allTokens)])
  })
  // for (const [scenario, source, errorMessagePattern] of errorCases) {
  //   it(`throws on ${scenario}`, () => {
  //     assert.throws(() => [...tokenize(source)], errorMessagePattern)
  //   })
  // }
})
