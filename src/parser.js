import { Program, Assignment, BinaryExpression, Call } from "./core.js";

const operators = ["*", "P", "+", "-", "j"];

//swatches: a map that stores all colors with its corresponding register and operator
//storing format: color : {PaletteID, operator}
const swatches = new Map(); //map swatch to register and oprator
//Palette: a map that stores all registers(which here is called swatch)
const palettes = new Map(); //map palette to value and size (register)

//format: [[new Assignment(), position], [new Call(), position]]
let statements = [];

let position = 0;

export default function parse(tokenStream) {
  parseStatements(tokenStream);
  return new Program(statements);
}

//to create a new register
function addToPalette(id, currentColor, tokenStream, swatchCount) {
  while (
    currentColor &&
    !swatches.get(currentColor) &&
    swatchCount <= 4
  ) {
    swatchCount++;
    palettes.get(id).swatches = swatchCount;
    swatches.set(currentColor, {
      palette: id,
      operator: operators[swatchCount - 1],
    });
    currentColor = tokenStream.next().value;
    position++;
  }
  position--;
  return currentColor;
}

function pushAssignment(target, operand1, operator, operand2) {
  statements.push(
    [new Assignment(target, new BinaryExpression(operator, operand1, operand2)), position]
  );
}

function parseStatements(tokenStream) {
  let colorA = tokenStream.next().value;

  while (colorA != undefined) {
    let swatchA = swatches.get(colorA);
    
    //if color A is a new color
    if (swatchA == undefined) {
      let colorB = tokenStream.next().value;
      if(!colorB){
        colorA = colorB;
        break;
      }
      let swatchB = swatches.get(colorB);

      //if there are two unseen colors in a row, create new register
      if (swatchB == undefined) {
        let newPaletteID = "P" + palettes.size;

        //start palette
        swatches.set(colorA, {
          palette: newPaletteID,
          operator: operators[0],
        });

        palettes.set(newPaletteID, { swatches: 1 });
        statements.push([new Assignment(newPaletteID, 0), position]);
        position += 2;


        //define new swatchess and go back to top
        colorA = addToPalette(newPaletteID, colorB, tokenStream, 1);
      } else {
        //swatchB is defined
        //back to top without consuming colorB
        colorA = colorB;
      }
    } else if (swatchA.operator != "*") {
      //single operator
      let operand = swatchA.palette;
      switch (swatchA.operator) {
        case "P": //print
          statements.push([new Call("print", operand), position]);
          position += 2;
          break;
        case "+": //++
         pushAssignment(operand, operand, "+", 1);
         position += 2;
          break;
        case "-": //--
          pushAssignment(operand, operand, "-", 1);
          position += 2;
          break;
        case "j": //jmp
          statements.push([new Call("goto", operand), position]);
          position += 2;
          break;
      }
      //back to top
      colorA = tokenStream.next().value;
    } else {
      //swatchA.operator == "*"
      let operandA = swatchA.palette;
      let paletteA = palettes.get(operandA);

      //look at next color
      let colorB = tokenStream.next().value;
      if (colorB != undefined) {
        let swatchB = swatches.get(colorB);
        if (swatchB == undefined) {
          let swatchCount = paletteA.swatches;
          if (swatchCount < 5) {
            console.log("did it added");
            //define new swatches and go back to top
            colorB = addToPalette(operandA, swatchB, tokenStream, swatchCount);
          } else {
            statements.push([new Call("print", swatchA.palette), position]);
            position += 2;
            //print
            //back to top without consuming colorB
            colorA = colorB;
          }
        } else {
          //swachB is defined
          let operandB = swatchB.palette;
          if (swatchB.operator != "P") {
            switch (swatchB.operator) {
              case "+": //escape
              position += 2;
                break;
              case "-": //=
                statements.push([new Assignment(operandA, operandB), 1]);
                position += 2;
                break;
              case "j": //if jmp
                statements.push([new Call("gotoIf", [operandA, operandB]), 1]);
                position += 2;
                break;
            }
            // back to top
            colorB = tokenStream.next().value;
          } else {
            //swatchB.operator == "P"
            //look at next color
            let colorC = tokenStream.next().value;

            if (colorC != undefined) {
              let swatchC = swatches.get(colorC);
              if (swatchC != undefined) {
                let operandC = swatchC.palette;
                switch (swatchC.operator) {
                  case "+": //+
                    pushAssignment(operandA, operandB, "+", operandC);
                    position += 3;
                    break;
                  case "-": //-
                    pushAssignment(operandA, operandB, "-", operandC);
                    position += 3;
                    break;
                  case "*": //*
                    pushAssignment(operandA, operandB, "*", operandC);
                    position += 3;
                    break;
                  case "j": // /
                    pushAssignment(operandA, operandB, "/", operandC);
                    position += 3;
                    break;
                }
                //back to top
                colorB = tokenStream.next().value;
              } else {
                //current swatchC is undefined
                //look at next swatch and make it new swatchC
                colorC = tokenStream.next().value;
                let swatchC = swatches.get(colorC);

                if (swatchC != undefined) {
                  let operandC = swatchC.palette;
                  switch (swatchC.operator) {
                    case "*": //**
                      pushAssignment(operandA, operandB, "^", operandC);
                      position += 4;
                      break;
                    case "j": //%
                      pushAssignment(operandA, operandB, "%", operandC);
                      position += 4;
                      break;
                    case "+": //nothing yet
                      position += 4;
                      break;
                    case "-": //nothing yet
                      position += 4;
                      break;
                  }
                  //back to top
                  colorB = tokenStream.next().value;
                }
              }
            }
            //*P followed by nothing
            //back to top without consuming colorC
            //will exit loop
            //colorA = colorC;
          }
        }
      }
      //* followed by nothing
      //back to top without consuming colorB
      //will exit loop
      colorA = colorB;
    }
  }
}

// export function clearStatement(){
//   statements.length = 0;
// }

//for test purpose
export function clear(){
  statements = [];
  swatches.clear();
  palettes.clear();
  position = 0;
}