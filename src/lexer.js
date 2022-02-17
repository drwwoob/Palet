import { Token, error } from "./core.js"

export default function* tokenize(program) {
  program.replace(/\r?\n/, '');
  let swatchNumber = 0
  for (let color of program.split(",")) {
    yield* new Token(swatchNumber, color)
    swatchNumber++
  }
}