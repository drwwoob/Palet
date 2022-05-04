import { Program, Assignment, BinaryExpression, Call } from "./core.js";
import tokenize from "./lexer.js";
import parse from "./parser.js";

// a map that stores all register with its value
const valueMap = new Map();
const resultString = [];


export default function compile(source) {
  const program = parse(tokenize(source));
  for(let i = 0; i < program.statements.length; i++){
    const statement = program.statements[i][0];
    console.log("statement:" + statement);
    if(statement.constructor.name === "Call"){
      switch(statement.callee){
        case "print":
          resultString.push(String.fromCharCode(valueMap.get(statement.args)));
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
      //if it is an Assignment, change the value stored in valueMap
      valueMap.set(statement.target,
        //if source is a number, store it directly
        typeof statement.source === 'number'?
        statement.source :
        //else if one of the computing value is a number, go to unary
          (typeof statement.source.right === 'number'?
          //else if they are both registers, go to binary
            computeUnary(statement.source) : computeBinary(statement.source)));
    }
  }
  return resultString.join();
}

function computeUnary(equation){
  switch(equation.op){
    case"+":
      return valueMap.get(equation.left) + equation.right;
    case"-":
      return valueMap.get(equation.left) - equation.right;
    case"/":
      return valueMap.get(equation.left) / equation.right;
    case"*":
      return valueMap.get(equation.left) * equation.right;
    case"^":
      return valueMap.get(equation.left) ** equation.right;
    case"%":
      return valueMap.get(equation.left) % equation.right;
    default:
      return new Error;
  }
}

function computeBinary(equation){
  switch(equation.op){
    case"+":
      return valueMap.get(equation.left) + valueMap.get(equation.right);
    case "-":
      return  valueMap.get(equation.left) - valueMap.get(equation.right);
    case "/":
      return  valueMap.get(equation.left) / valueMap.get(equation.right);
    case "*":
      return  valueMap.get(equation.left) * valueMap.get(equation.right);
    case "^":
      return  valueMap.get(equation.left) ** valueMap.get(equation.right);
    case "%":
      return  valueMap.get(equation.left) % valueMap.get(equation.right);
    default:
      return new Error;
  }
}

export function clearCompiler(){
  valueMap.clear();
}