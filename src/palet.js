#! /usr/bin/env node

import fs from "fs/promises";
import process from "process";

import compile from "./compiler.js";

const help = `Palet compiler

Syntax: node palet.js <filename> <outputType>

Prints to stdout according to <outputType>, which must be one of:
  tokens     the token sequence
  ast        the abstract syntax tree
`;

async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename);
    console.log(compile(buffer.toString(), outputType));
  } catch (e) {
    console.error(`\u001b[31m${e}\u001b[39m`);
    process.exitCode = 1;
  }
}

if (process.argv.length !== 4) {
  console.log(help);
} else {
  compileFromFile(process.argv[2], process.argv[3]);
}
