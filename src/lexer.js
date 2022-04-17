import { Color } from "./core.js";

export default function* tokenize(program) {
program = program.replace(/\s/g, "");
  // let tokenNumber = 0;
  let previousColor = "";

  for (let color of program.split(",")) {
    if (color != previousColor && color) {
      // yield new Token(tokenNumber, color);
      yield new Color(color);
      previousColor = color;
    }
  }
  yield new Color("END");
}