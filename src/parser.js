import { Program, Assignment, BinaryExpression, Call } from "./core.js";

const operators = ["*", "P", "+", "-", "+"];

const colors = new Map(); //map color to register and oprator
const palettes = new Map(); //map palette to value and size (register)

const statements = [];

export default function parse(tokenStream) {
  parseStatements(tokenStream);
  return new Program(statements);
}

function addToPalette(
  id,
  currentColor,
  tokenStream,
  swatchCount = palettes.get(id).swatches
) {
  let currentColor = currentColor;
  let nextToken = tokenStream.next().value;

  while (colors.get(currentColor) == undefined && swatchCount <= 5) {
    swatchCount++;
    palettes.get(id).swatches = swatchCount;
    colors.set(currentColor, {
      palette: id,
      operator: operators[swatchCount - 1],
    });

    nextToken = tokenStream.next().value;
    let currentColor = colors.get(nextToken);
  }
  return nextToken;
}

function pushAssignment(target, operand1, operator, operand2) {
  statements.push(
    new Assignment(target, new BinaryExpression(operator, operand1, operand2))
  );
}

function parseStatements(tokenStream) {
  let nextToken = tokenStream.next().value;

  while (nextToken != null) {
    let colorA = colors.get(nextToken);

    if (colorA == undefined) {
      //look at next color
      nextToken = tokenStream.next().value;
      let colorB = colors.get(nextToken);

      if (colorB == undefined) {
        let newPaletteID = "P" + palettes.size;

        //start palette
        colors.set(colorA, { palette: newPaletteID, operator: operators[0] });
        palettes.set(newPaletteID, { swatches: 1 });
        statements.push(new Assignment(newPaletteID, 0));

        //define new colors and go back to top
        nextToken = addToPalette(newPaletteID, colorB, tokenStream);
      }
      //else back to top without consuming colorB
    } else if (colorA.operator != "*") {
      let register = palettes.get(colorA).palette;
      switch (colorA.operator) {
        case "P": //print
          statements.push(new Call("print", register));
        case "+": //++
          pushAssignment(register, register, "+", 1);
        case "-": //--
          pushAssignment(register, register, "-", 1);
        case "j": //jmp
          statements.push(new Call("goto", register));
      }
      //back to top
      nextToken = tokenStream.next().value;
    } else {
      //colorA.operator == "*"
      let registerA = palettes.get(colorA).palette;

      //look at next color
      nextToken = tokenStream.next().value;
      let colorB = colors.get(nextToken);

      if (colorB == undefined) {
        swatchCount = palettes.get(registerdA).palette;
        if (swatchCount < 5) {
          //define new colors and go back to top
          nextToken = addToPalette(registerA, colorB, tokenStream);
        } else {
          statements.push(new Call("print", [registerA]));
          //print
          //back to top without consuming colorB
        }
      } else {
        let registerB = palettes.get(colorB).palette;

        if (colorB.operator != "P") {
          switch (colorB.operator) {
            case "+": //+=
              pushAssignment(registerA, registerA, "+", registerB);
            case "-": //-=
              pushAssignment(registerA, registerA, "-", registerB);
            case "j": //if jmp
              statements.push(new Call("goto", [operandA, operandB]));
          }
          // back to top
          nextToken = tokenStream.next().value;
        } else {
          //colorB.operator == "P"
          //look at next color
          nextToken = tokenStream.next().value;
          let colorC = colors.get(nextToken);

          if (colorC != undefined) {
            let registerC = palettes.get(colorC).palette;
            switch (colorC.operator) {
              case "+": //+
                pushAssignment(registerA, registerB, "+", registerC);
              case "-": //-
                pushAssignment(registerA, registerB, "-", registerC);
              case "*": //*
                pushAssignment(registerA, registerB, "*", registerC);
              case "j": ///
                pushAssignment(registerA, registerB, "/", registerC);
            }
            //back to top
            nextToken = tokenStream.next().value;
          } else {
            //current colorC is undefined
            //look at next color and make it colorC
            nextToken = tokenStream.next().value;
            let colorC = colors.get(nextToken);

            if (colorC != undefined) {
              let registerC = palettes.get(colorC).palette;
              switch (colorC.operator) {
                case "*": //**
                  pushAssignment(registerA, registerB, "^", registerC);
                case "j": //%
                  pushAssignment(registerA, registerB, "%", registerC);
                case "+": //nothing yet
                case "-": //nothing yet
              }
              //back to top
              nextToken = tokenStream.next().value;
            }
            //back to top without consuming colorC
          }
        }
      }
    }
  }
}
