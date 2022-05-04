// Run Palet Programs from the command line

import fs from "fs/promises";
import process from "process";
import tokenize from "../src/lexer.js";
import generate from "../src/generator.js";
import parse from "../src/parser.js";

async function compileFromFile(filename) {
  try {
    const buffer = await fs.readFile(filename);
    console.log(generate(parse(tokenize(buffer.toString()))));
  } catch (e) {
    console.error(`\u001b[31m${e}\u001b[39m`);
    process.exitCode = 1;
  }
}

if (process.argv.length !== 3) {
  console.log(`Call this like this: "node runpalet.js <program>"`);
} else {
  compileFromFile(process.argv[2]);
}
