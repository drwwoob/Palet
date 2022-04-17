import tokenize from "./lexer.js";
import parse from "./parser.js";

export default function compile(source, outputType) {
  const tokens = tokenize(source);
  if (outputType === "tokens") return [...tokens];
  const ast = parse(tokens);
  if (outputType === "ast") return ast;
  const analyzed = analyze(ast);
  throw new Error("Unknown output type");
}
