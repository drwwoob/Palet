// CODE GENERATOR: Palet -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.
import parse, { /*clearStatement,*/ clear } from "../src/parser.js";
import tokenize from "../src/lexer.js";

export default function generate(program) {
  const output = [];
  const seen = new Array();

  output.push("#include <stdio.h>");
  output.push("int main (){");

  for (let i = 0; i < program.statements.length; i++) {
    const statement = program.statements[i][0];
    if (statement.constructor.name === "Call") {
      switch (statement.callee) {
        case "printNum":
          output.push(`printf(${statement.args});`);
          break;
        case "print":
          output.push(`printf((char)${statement.args});`);
          break;
        case "gotoIf":
          break;
        case "goto":
          break;
        default:
          break;
      }
    } else {
      //if it is an Assignment
      //check if it is a new variable
      if (!seen.find((a) => a === statement.target)) {
          output.push("int " + statement.target + " = 0;");
        seen.push(statement.target);
      }
      else if(statement.source.constructor.name === "String"){
        output.push(statement.target + " = " + statement.source + ";");
      }
      // if it is a operation on the right
      else {
        if (
        statement.target === statement.source.left &&
        statement.source.right === 1){
          if(statement.source.op === "+"){
            output.push(statement.target + "++;");
          }
          else if(statement.source.op === "-")
            output.push(statement.target + "--;");
        }
        else{
        output.push(
          statement.target +
            " = " +
            statement.source.left +
            statement.source.op +
            statement.source.right + 
            ";"
        );
        }
      }
    }
  }
  output.push("return 0;");
  output.push("}");
  return output.join("\n");
}
