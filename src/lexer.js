// import { Token } from "./core.js";

export default function* tokenize(program) {
program = program.replace(/\s/g, "");
  // let tokenNumber = 0;
  let previousColor = "";

  for (let color of program.split(",")) {
    if (color != previousColor) {
      // yield new Token(tokenNumber, color);
      yield color;
      previousColor = color;
    }
    // tokenNumber++;
  }
}
