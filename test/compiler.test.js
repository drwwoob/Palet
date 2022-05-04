import { Program, Assignment, BinaryExpression, Call } from "../src/core.js";
import compile, {  clearCompiler } from "../src/compiler.js"
import assert from "assert/strict"
import parse, {/*clearStatement,*/ clear} from "../src/parser.js"
import tokenize from "../src/lexer.js"

const exampleCheck = [
 ["+, *, +", "!", 33, 
    // *p+-J +(1) ? +(2) *p*(4) ? *p*(16) ? *p+(32) ? +(33) p(print)
    `red1, red2, red3, red4, red5, red3, pink, 
        red3, red1, red2, red1, pink,
        red1, red2, red1, pink, red1, red2, red3, pink,
        red3, red2"`],
]

describe("able to compute with unary operator", () => {
    for (const [operator, expected, asciiNum, source] of exampleCheck) {
      it(`execute operator ${operator} that should get the result number ${asciiNum}`, () =>{
        assert.deepEqual(compile(source), expected);
        clearCompiler();
        clear();
      })
    }
  })