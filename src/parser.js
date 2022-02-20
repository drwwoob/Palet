import { Program, Assignment, BinaryExpression, Call } from "./core.js";

const operators = ["*", "P", "+", "-", "+"];

const swatches = new Map(); //map swatch to register and oprator
const palettes = new Map(); //map palette to value and size (register)

const statements = [];

export default function parse(tokenStream) {
  parseStatements(tokenStream);
  return new Program(statements);
}

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
  let nextColor = tokenStream.next().value;

  while (nextColor != undefined) {
    let swatchA = swatches.get(nextColor);

    if (swatchA == undefined) {
      let colorA = nextColor;
      nextColor = tokenStream.next().value;
      let swatchB = swatches.get(nextColor);

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
        nextColor = addToPalette(newPaletteID, nextColor, tokenStream, 1);
      }
      //else back to top without consuming swatchB
    } else if (swatchA.operator != "*") {
      let operand = swatchA.palette;
      switch (swatchA.operator) {
        case "P": //print
          statements.push(new Call("print", operand));
        case "+": //++
          pushAssignment(operand, operand, "+", 1);
        case "-": //--
          pushAssignment(operand, operand, "-", 1);
        case "j": //jmp
          statements.push(new Call("goto", operand));
      }
      //back to top
      nextColor = tokenStream.next().value;
    } else {
      //swatchA.operator == "*"
      let operandA = swatchA.palette;
      let paletteA = palettes.get(operandA);

      //look at next color
      nextColor = tokenStream.next().value;
      console.log(nextColor);
      if (nextColor != undefined) {
        let swatchB = swatches.get(nextColor);

        if (swatchB == undefined) {
          let swatchCount = paletteA.swatches;
          if (swatchCount < 5) {
            //define new swatches and go back to top
            nextColor = addToPalette(
              paletteA,
              swatchB,
              tokenStream,
              swatchCount
            );
          } else {
            statements.push(new Call("print", swatchA.palette));
            //print
            //back to top without consuming swatchB
          }
        } else {
          //swachB is defined
          let operandB = swatchB.palette;

          if (swatchB.operator != "P") {
            switch (swatchB.operator) {
              case "+": //+=
                pushAssignment(operandA, operandA, "+", operandB);
              case "-": //-=
                pushAssignment(operandA, operandA, "-", operandB);
              case "j": //if jmp
                statements.push(new Call("goto", [operandA, operandB]));
            }
            // back to top
            nextColor = tokenStream.next().value;
          } else {
            //swatchB.operator == "P"
            //look at next color
            nextColor = tokenStream.next().value;
            if (nextColor != undefined) {
              let swatchC = swatches.get(nextColor);

              if (swatchC != undefined) {
                let operandC = swatchC.palette;
                switch (swatchC.operator) {
                  case "+": //+
                    pushAssignment(paletteA, operandB, "+", operandC);
                  case "-": //-
                    pushAssignment(paletteA, operandB, "-", operandC);
                  case "*": //*
                    pushAssignment(paletteA, operandB, "*", operandC);
                  case "j": ///
                    pushAssignment(paletteA, operandB, "/", operandC);
                }
                //back to top
                nextColor = tokenStream.next().value;
              } else {
                //current swatchC is undefined
                //look at next swatch and make it swatchC
                nextColor = tokenStream.next().value;
                let swatchC = swatches.get(nextColor);

                if (swatchC != undefined) {
                  let operandC = swatchC.palette;
                  switch (swatchC.operator) {
                    case "*": //**
                      pushAssignment(paletteA, operandB, "^", operandC);
                    case "j": //%
                      pushAssignment(paletteA, operandB, "%", operandC);
                    case "+": //nothing yet
                    case "-": //nothing yet
                  }
                  //back to top
                  nextColor = tokenStream.next().value;
                }
                //back to top without consuming swatchC
              }
            }
          }
        }
      }
    }
  }
}
