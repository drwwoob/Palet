import { Program, Assignment, BinaryExpression, Call } from "./core.js";

const operators = ["*", "P", "+", "-", "+"];

const swatches = new Map(); //map swatch to register and oprator
const palettes = new Map(); //map palette to value and size (register) (used to store register)

const statements = [];

export default function parse(tokenStream) {
  parseStatements(tokenStream);
  return new Program(statements);
}

//to create a new register
function addToPalette(id, currentColor, tokenStream, swatchCount) {
  while (
    currentColor != undefined &&
    swatches.get(currentColor) == undefined &&
    swatchCount <= 5
  ) {
    swatchCount++;
    palettes.get(id).swatches = swatchCount;
    swatches.set(currentColor, {
      palette: id,
      operator: operators[swatchCount - 1],
    });
    currentColor = tokenStream.next().value;
  }

  return currentColor;
}

function pushAssignment(target, operand1, operator, operand2) {
  statements.push(
    new Assignment(target, new BinaryExpression(operator, operand1, operand2))
  );
}

function parseStatements(tokenStream) {
  let colorA = tokenStream.next().value;

  while (colorA != undefined) {
    let swatchA = swatches.get(colorA);

    //if color A is a new color
    if (swatchA == undefined) {
      let colorB = tokenStream.next().value;
      // if(colorB){
      //   return;
      // }
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
        statements.push(new Assignment(newPaletteID, 0));

        //define new swatchess and go back to top
        colorA = addToPalette(newPaletteID, colorB, tokenStream, 1);
      } else {
        //swatchB is defined
        //back to top without consuming colorB
        colorA = colorB;
      }
    } else if (swatchA.operator != "*") {
      let operand = swatchA.palette;
      switch (swatchA.operator) {
        case "P": //print
          statements.push(new Call("print", operand));
          break;
        case "+": //++
          pushAssignment(operand, operand, "+", 1);
          break;
        case "-": //--
          pushAssignment(operand, operand, "-", 1);
          break;
        case "j": //jmp
          statements.push(new Call("goto", operand));
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
            //define new swatches and go back to top
            colorA = addToPalette(paletteA, swatchB, tokenStream, swatchCount);
          } else {
            statements.push(new Call("print", swatchA.palette));
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
                break;
              case "-": //-=
                statements.push(new Assignment(operandA, operandB));
                break;
              case "j": //if jmp
                statements.push(new Call("gotoIf", [operandA, operandB]));
                break;
            }
            // back to top
            colorA = tokenStream.next().value;
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
                    pushAssignment(paletteA, operandB, "+", operandC);
                    break;
                  case "-": //-
                    pushAssignment(paletteA, operandB, "-", operandC);
                    break;
                  case "*": //*
                    pushAssignment(paletteA, operandB, "*", operandC);
                    break;
                  case "j": ///
                    pushAssignment(paletteA, operandB, "/", operandC);
                    break;
                }
                //back to top
                colorA = tokenStream.next().value;
              } else {
                //current swatchC is undefined
                //look at next swatch and make it new swatchC
                colorC = tokenStream.next().value;
                let swatchC = swatches.get(colorC);

                if (swatchC != undefined) {
                  let operandC = swatchC.palette;
                  switch (swatchC.operator) {
                    case "*": //**
                      pushAssignment(paletteA, operandB, "^", operandC);
                      break;
                    case "j": //%
                      pushAssignment(paletteA, operandB, "%", operandC);
                      break;
                    case "+": //nothing yet
                      break;
                    case "-": //nothing yet
                      break;
                  }
                  //back to top
                  colorA = tokenStream.next().value;
                }
                //back to top without consuming colorC
                colorA = colorC;
              }
            }
            //*P followed by nothing
            //back to top without consuming colorC
            //will exit loop
            colorA = colorC;
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
