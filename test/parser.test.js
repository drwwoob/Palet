import assert from "assert/strict"
import util from "util"
import {parse, clear} from "../src/parser.js"
import tokenize from "../src/lexer.js"
import { Program, Assignment, BinaryExpression, Call } from "../src/core.js";

describe('The differentiator', () => {
  //detecting empty string, though i think this would not happen
  it('detects empty string', () => {
    assert.throws(() => parse([]))
    //assert.throws(() => derivative('blah'))
  })
})

// define register
const defineReg = [
  //["single color", "red1", new Program([])],
  ["*p", "red1, red2", new Program([new Assignment("P0", 0)])],
  ["*p+", "red1, red2, red3", new Program([new Assignment("P0", 0)])],
  ["*p+-", "red1, red2, red3, red4", new Program([new Assignment("P0", 0)])],
  ["*p+-J", "red1, red2, red3, red4, red5", new Program([new Assignment("P0", 0)])],
  ["*p+-J", "red1, red2, red3, red4, red5, pink", new Program([new Assignment("P0", 0)])],
  //["*p+-J*", "red1, red2, red3, red4, red5, red1, pink", new Program([new Assignment("P0", 0)])],
  ["*p+-J *p", "red1, red2, red3, red4, red5, orange1, orange2", new Program([new Assignment("P0", 0), new Assignment("P1", 0)])],
]

// the test
describe("The parser can recognize a list of different colors and create register", () => {
  for (const [translation, source, expected] of defineReg) {
    it(`recognizes ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})
  
//test break operator
const breakExample = [
  ["*p+ break", "red1, red2, red3, red1, red3", new Program([new Assignment("P0", 0)])],
  ["*p+- break", "red1, red2, red3, red4, red1, red3", new Program([new Assignment("P0", 0)])],
  ["*p+-J break", "red1, red2, red3, red4, red5, red1, red3", new Program([new Assignment("P0", 0)])],
  ["*p+- break break", "red1, red2, red3, red1, red3, red1, red3", new Program([new Assignment("P0", 0)])],
  ["*p+- break *p", "red1, red2, red3, red1, red3, orange1, orange2", new Program([new Assignment("P0", 0), new Assignment("P1", 0)])],
]

describe("The parser is able to recognize \"break\" operator", () => {
  for (const [translation, source, expected] of breakExample) {
    it(`recognizes ${translation}(*+)`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

// const syntaxErrors = [
//   [
//     "non-letter in an identifier",
//     "ab😭c = 2",
//     /Line 1, Column 2: Unexpected character: '😭'/,
//   ],
//   ["malformed number", "x= 2.", /Line 1, Column 6: Digit expected/],
//   ["missing semicolon", "x = 3 y = 1", /Line 1, Column 7: Expected ';'/],
//   [
//     "a missing right operand",
//     "print(5 -",
//     /Line 2, Column 1: Expected id, number, or '\('/,
//   ],
//   [
//     "a non-operator",
//     "print(7 * ((2 _ 3)",
//     /Line 1, Column 14: Unexpected character: '_'/,
//   ],
//   [
//     "an expression starting with a )",
//     "x = );",
//     /Line 1, Column 5: Expected id, number, or '\('/,
//   ],
//   [
//     "a statement starting with expression",
//     "x * 5;",
//     /Error: Line 1, Column 3: "=" or "\(" expected/,
//   ],
//   [
//     "an illegal statement on line 2",
//     "print(5);\nx * 5;",
//     /Line 2, Column 3: "=" or "\(" expected/,
//   ],
//   [
//     "a statement starting with a )",
//     "print(5);\n) * 5",
//     /Line 2, Column 1: Statement expected/,
//   ],
//   [
//     "an expression starting with a *",
//     "x = * 71;",
//     /Line 1, Column 5: Expected id, number, or '\('/,
//   ],
// ]

// const source = `x=-1;print(x**5);`

// const expectedAst = new core.Program([
//   new core.Assignment(
//     new core.Token("Id", "x", 1, 1),
//     new core.UnaryExpression(
//       new core.Token("Sym", "-", 1, 3),
//       new core.Token("Num", "1", 1, 4)
//     )
//   ),
//   new core.Call(
//     new core.Token("Id", "print", 1, 6),
//     [
//       new core.BinaryExpression(
//         new core.Token("Sym", "**", 1, 13),
//         new core.Token("Id", "x", 1, 12),
//         new core.Token("Num", "5", 1, 15)
//       ),
//     ],
//     true
//   ),
// ])

// describe("The parser", () => {
//   for (const [scenario, source] of syntaxChecks) {
//     it(`recognizes that ${scenario}`, () => {
//       assert(parse(tokenize(source)))
//     })
//   }
//   for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
//     it(`throws on ${scenario}`, () => {
//       assert.throws(() => parse(tokenize(source)), errorMessagePattern)
//     })
//   }
//   it("produces the expected AST for all node types", () => {
//     assert.deepEqual(parse(tokenize(source)), expectedAst)
//   })
// })