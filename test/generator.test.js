import assert from "assert/strict"
import tokenize from "../src/lexer.js"
import generate from "../src/generator.js"
import parse, { /*clearStatement,*/ clear} from "../src/parser.js"
import compile, {  clearCompiler } from "../src/compiler.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
    {
      name: "plus 1",
      source:  "red1, red2, red3, red4, red5, red3",
      expected: dedent`
        let P0 = 0
        P0 = P0+1
      `,
    },
]

describe("The code generator", () => {
    for (const fixture of fixtures) {
      it(`produces expected js output for the ${fixture.name} program`, () => {
        const actual = generate(parse(tokenize(fixture.source)))
        assert.deepEqual(actual, fixture.expected)
        clearCompiler();
        clear();
      });
    }
  })