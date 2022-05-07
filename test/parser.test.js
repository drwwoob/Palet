import assert from "assert/strict"
import util from "util"
import parse, { /*clearStatement,*/ clear} from "../src/parser.js"
import tokenize from "../src/lexer.js"
import { Program, Assignment, BinaryExpression, Call } from "../src/core.js";

describe('Empty String', () => {
  //detecting empty string, though i think this would not happen
  it('detects empty string', () => {
    assert.throws(() => parse([]))
    //assert.throws(() => derivative('blah'))
  })
})

// define register
const defineReg = [
  ["single color", "red1", new Program([])],
  ["*p", "red1, red2", 
    new Program([[new Assignment("P0", 0), 0]])],
  ["*p+", "red1, red2, red3", 
  new Program([[new Assignment("P0", 0), 0]])],
  ["*p+-", "red1, red2, red3, red4", 
  new Program([[new Assignment("P0", 0), 0]])],
  ["*p+-J", "red1, red2, red3, red4, red5", 
  new Program([[new Assignment("P0", 0), 0]])],
  ["*p+-J ?", "red1, red2, red3, red4, red5, pink", 
  new Program([[new Assignment("P0", 0), 0]])],
  ["*p+-J *p", "red1, red2, red3, red4, red5, orange1, orange2", 
    new Program([[new Assignment("P0", 0), 0], [new Assignment("P1", 0), 5]])],
]


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
  ["*p+ *+", "red1, red2, red3, red1, red3", 
  new Program([[new Assignment("P0", 0), 0]])],
  ["*p+- *+", "red1, red2, red3, red4, red1, red3", 
  new Program([[new Assignment("P0", 0), 0]])],
  ["*p+-J *+", "red1, red2, red3, red4, red5, red1, red3", 
  new Program([[new Assignment("P0", 0), 0]])],
  ["*p+- *+ *+", "red1, red2, red3, red1, red3, red1, red3", 
  new Program([[new Assignment("P0", 0), 0]])],
  ["*p+- *+ *p", "red1, red2, red3, red1, red3, orange1, orange2", 
  new Program([[new Assignment("P0", 0), 0], [new Assignment("P1", 0), 5]])],
]

describe("The parser is able to recognize \"break\"(*+) operator", () => {
  for (const [translation, source, expected] of breakExample) {
    it(`recognizes ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

const addToReg = [
  ["*p+ *+ *-", "red1, red2, red3, red1, red3, red1, red4", new Program([[new Assignment("P0", 0), 0]])],
]

describe("The parser is able to add color to a register", () => {
  for (const [translation, source, expected] of addToReg) {
    it(`added color with the command ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

const singleOp = [
  ["+", "*p+-J +", "red1, red2, red3, red4, red5, red3",
    new Program([[new Assignment("P0", 0), 0], [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 5]])],
  ["-", "*p+-J -", "red1, red2, red3, red4, red5, red4", 
    new Program([[new Assignment("P0", 0), 0], [new Assignment("P0", new BinaryExpression("-", "P0", 1)), 5]])],
 ]

describe("The parser is able to execute a single binary operator", () => {
  for (const [operand, translation, source, expected] of singleOp) {
    it(`test operand \"${operand}\" using the command ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

const singleCall = [
  ["P", "*p+-J p", "red1, red2, red3, red4, red5, red2",
  new Program([[new Assignment("P0", 0), 0], [new Call("print", "P0"), 5]])],
  ["J", "*p+-J ? J", "red1, red2, red3, red4, red5, pink, red5", 
    new Program([[new Assignment("P0", 0), 0], [new Call("goto", "P0"), 6]])],
]

describe("The parser is able to execute a single call", () => {
  for (const [operand, translation, source, expected] of singleCall) {
    it(`test operand \"${operand}\" using the command ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

const specialCasePrint = [
  ["*p+-J *?", "red1, red2, red3, red4, red5, red1, pink",
    new Program([[new Assignment("P0", 0), 0], [new Call("printNum", "P0"), 5]])],
]

describe("The parser is able to print with *?", () => {
  for (const [translation, source, expected] of specialCasePrint) {
    it(`recognizes ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

const duaInSingle = [
  ["=","*p+-J *-", "red1, red2, red3, red4, red5, yellow, red1, red4",
    new Program([[new Assignment("P0", 0), 0], [new Assignment("P0", "P0"), 6]])],
  ["jump to A if !B", "*p+-J *J", "red1, red2, red3, red4, red5, red1, red5",
    new Program([[new Assignment("P0", 0), 0], [new Call("gotoIf", ["P0", "P0"]), 5]])],
  ]

describe("The parser is able to execute a two-operator operation that's located in a single register", () => {
  for (const [operand, translation, source, expected] of duaInSingle) {
    it(`test \"${operand}\" using the command ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

const triInSingle = [
  ["r1 = r1 + r1", "*p+-J + *p+", "red1, red2, red3, red4, red5, red3, red1, red2, red3",
    new Program([[new Assignment("P0", 0), 0], 
      [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 5],
      [new Assignment("P0", new BinaryExpression("+", "P0", "P0")), 6]])],
  ["r1 = r1 - r1", "*p+-J + *p-", "red1, red2, red3, red4, red5, red3, red1, red2, red4",
    new Program([[new Assignment("P0", 0),0,], 
      [new Assignment("P0", new BinaryExpression("+", "P0", 1)),5],
      [new Assignment("P0", new BinaryExpression("-", "P0", "P0")),6]])],
    ["r1 = r1 * r1", "*p+-J + *p*", "red1, red2, red3, red4, red5, red3, red1, red2, red1",
      new Program([[new Assignment("P0", 0), 0], 
        [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 5],
        [new Assignment("P0", new BinaryExpression("*", "P0", "P0")), 6]])],
    ["r1 = r1 / r1", "*p+-J + *pJ", "red1, red2, red3, red4, red5, red3, red1, red2, red5",
      new Program([[new Assignment("P0", 0), 0], 
        [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 5],
        [new Assignment("P0", new BinaryExpression("/", "P0", "P0")), 6]])],
]

describe("The parser is able to execute a three-operator operation that's located in a single register", () => {
  for (const [operand, translation, source, expected] of triInSingle) {
    it(`test \"${operand}\" using the command ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

const quaInSingle = [
  ["r1 = r1 ^ r1", "*p+-J + *p?*", "red1, red2, red3, red4, red5, red3, red1, red2, pink, red1",
    new Program([[new Assignment("P0", 0), 0],
      [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 5],
      [new Assignment("P0", new BinaryExpression("^", "P0", "P0")), 6]])],
  ["r1 = r1 % r1", "*p+-J + *p?J", "red1, red2, red3, red4, red5, red3, red1, red2, pink, red5",
    new Program([[new Assignment("P0", 0), 0],
      [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 5],
      [new Assignment("P0", new BinaryExpression("%", "P0", "P0")), 6]])],
  ["undefined", "*p+-J *p?+", "red1, red2, red3, red4, red5, red1, red2, pink, red3",
    new Program([[new Assignment("P0", 0), 0]])],
  ["undefined", "*p+-J *p?-", "red1, red2, red3, red4, red5, red1, red2, pink, red4",
    new Program([[new Assignment("P0", 0), 0]])],

]

describe("The parser is able to execute a four-operator operation that's located in a single register", () => {
  for (const [operand, translation, source, expected] of quaInSingle) {
    it(`test \"${operand}\" using the command ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})

const examp = [
  ["+, *, +", "!", 33, 
  // *p+-J +(1) ? +(2) *p*(4) ? *p*(16) ? *p+(32) ? +(33) p(print)
  `red1, red2, red3, red4, red5,
      red3, pink, 
      red3, 
      red1, red2, red1, pink,
      red1, red2, red1, pink,
      red1, red2, red3, pink,
      red3,
      red2`,
  new Program([[new Assignment("P0", 0), 0],
    [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 5],
    [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 7],
    [new Assignment("P0", new BinaryExpression("*", "P0", "P0")), 8],
    [new Assignment("P0", new BinaryExpression("*", "P0", "P0")), 12],
    [new Assignment("P0", new BinaryExpression("+", "P0", "P0")), 16],
    [new Assignment("P0", new BinaryExpression("+", "P0", 1)), 20],
    [new Call("print", "P0"), 21]
  ])],
]

describe("example", () => {
  for (const [operand, translation, ascii, source, expected] of examp) {
    it(`test \"${operand}\" using the command ${translation}`, () =>{
      assert.deepEqual(parse(tokenize(source)), expected);
      clear();
    })
  }
})