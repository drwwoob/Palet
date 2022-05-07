import assert from "assert/strict";
import tokenize from "../src/lexer.js";
import generate from "../src/generator.js";
import parse, { /*clearStatement,*/ clear } from "../src/parser.js";
import compile, { clearCompiler } from "../src/compiler.js";

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim();
}

const fixtures = [
  {
    name: "plus 1, print",
    source: "red1, red2, red3, red4, red5, red3, red2",
    expected: dedent`
      #include <stdio.h>
      int main (){
        int P0 = 0;
        P0++;
        printf((char)P0);
        return 0;
      }
      `,
  },
  {
    name: "print 42",
    source: `red1, red2, red3, red4, red5, red3, orange, red3, orange, red3,
      blue1, blue2, blue3, blue4, blue5, blue1, red4,
      blue1, blue2, blue3, blue4, green1, green2, green3, green4, green1, green3,
      green1, red4, red1, red2, red1, orange, red1, red2, blue1,
      red1, red2, green4, orange, red1, orange`,
    expected: dedent`
      #include <stdio.h>
      int main (){
        int P0 = 0;
        P0++;
        P0++;
        P0++;
        int P1 = 0;
        P1 = P0;
        P1 = P1+P1;
        P1--;
        int P2 = 0;
        P2 = P0;
        P0 = P0*P0;
        P0 = P0*P1;
        P0 = P0-P2;
        printf(P0);
        return 0;
        }
      `,
  },
];

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(parse(tokenize(fixture.source)));
      assert.deepEqual(actual, fixture.expected);
      clearCompiler();
      clear();
    });
  }
});
