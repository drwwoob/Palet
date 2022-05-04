// CODE GENERATOR: Palet -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.
import parse, { /*clearStatement,*/ clear} from "../src/parser.js"
import tokenize from "../src/lexer.js"


export default function generate(program) {
    const output = [];
    const seen = new Array();
    
  for(let i = 0; i < program.statements.length; i++){
    const statement = program.statements[i][0];
    if(statement.constructor.name === "Call"){
      switch(statement.callee){
        case "print":
          output.push("console.log(" + String.fromCharCode(valueMap.get(statement.args)) + ");");
          break;
        case "gotoIf":
          break;
        case "goto":
          break;
        default:
          break;
      }
    }
    else{
        //if it is an Assignment
        //check if it is a new variable
        console.log(statement.target);
        console.log(!seen.find((a) => a === statement.target));
        if(!seen.find((a) => a === statement.target)){
            output.push("let " + statement.target + " = 0");
            console.log("let " + statement.target + " = 0");
            seen.push(statement.target);
        }
        //if not a new variable
        else{
            // if it is a number on the right
            if(statement.source === 'number'){
                output.push(statement.target + " = " + statement.source);
            }
            // if it is a operation on the right
            else{
                output.push(statement.target + " = " + statement.source.left + statement.source.op + statement.source.right);
            }
        }
    }
  }
  return output.join('\n');
}