export default function* tokenize(program) {
  //get rid of all spaces
  program = program.replace(/\s/g, "");
  let previousColor = "";

  for (let color of program.split(",")) {
    if (color != previousColor && color) {
      yield color;
      previousColor = color;
    }
  }
  yield "END";
}