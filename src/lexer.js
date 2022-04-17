import { Token, error } from "./core.js"

export default function* tokenize(program) {
  program = program.replace(/\s/g, "");
  let swatchNumber = 0
  for (let color of program.split(",")) {
    yield* new Token(swatchNumber++, color)
  }
  yield new Token(swatchNumber++, "END")
}