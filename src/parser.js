import {
  Program,
  Assignment,
  Call,
  BinaryExpression,
  UnaryExpression,
  error,
} from "./core.js"

const operators = ["*", "P", "+", "-", "+"]

const colors = new Map() //map color to register and oprator
const palettes = new Map() //map palette to value and size (register)

function addToPalette(id, currentColor, tokenStream, swatchCount = palettes.get(id).swatches){
  let currentColor = currentColor
  let nextToken = tokenStream.next().value

  while (colors.get(currentColor) == undefined && swatchCount <= 5) {
    swatchCount ++;
    palettes.get(id).swatches = swatchCount
    colors.set(currentColor, {palette: id, operator: operators[swatchCount-1]})
    
    nextToken = tokenStream.next().value
    let currentColor =  colors.get(nextToken)
  }
  return nextToken
}

export default function parse(tokenStream) {
  let nextToken = tokenStream.next().value
    
  while (nextToken != null) {
    let colorA = colors.get(nextToken)
    
    if (colorA == undefined) {
      //look at next color
      nextToken = tokenStream.next().value
      let colorB = colors.get(nextToken)
      
      if (colorB == undefined) {
        let paletteID = "P"+(palettes.size)

        //start palette
        colors.set(colorA, {palette: paletteID, operator: operators[0]})
        palettes.set(paletteID, {vale: 0, swatches: 1})

        //define new colors and go back to top
        nextToken = addToPalette(paletteID, colorB, tokenStream)
        
      }
      //else back to top without consuming colorB

    } else if (colorA.operator != "*") { 
      switch (colorA.operator) {
        case "P": //print
        case "+": //++
        case "-": //--
        case "j": //jmp
      }
      //back to top
      nextToken = tokenStream.next().value
      
    } else {
      //colorA.operator == "*"
      nextToken = tokenStream.next().value
      let colorB = colors.get(nextToken)

      if (colorB == undefined) {
        swatchCount = palettes.get(id).swatches
        if (swatchCount < 5) {
          //define new colors and go back to top
          nextToken = addToPalette(palettes.get(colorA.palette), colorB, tokenStream)
        } else {
          //print
          //back to top without consuming colorB
        }
      } else if (colorB.operator != "P") {
        switch (colorB.operator) {
          case "+": //+=
          case "-": //-=
          case "j": //if jmp
        }
        // back to top
        nextToken = tokenStream.next().value
      } else {
         //colorB.operator == "P"
         //look at next color
         nextToken = tokenStream.next().value
         let colorC = colors.get(nextToken)

         if (colorC != undefined) {
            switch (colorC.operator) {
              case "+": //+
              case "-": //-
              case "*": //*
              case "j": ///
            }
            //back to top  
            nextToken = tokenStream.next().value
         } else {
          //colorC is undefined
          //look at next color
          nextToken = tokenStream.next().value
          let colorD = colors.get(nextToken)

          if (colorD != undefined) {
            switch (colorD.operator) {
              case "*": //%
              case "j": //^
              case "+": //nothing yet
              case "-": //nothing yet
            }
            //back to top
            nextToken = tokenStream.next().value
          }
          //back to top without consuming colorD
        }
      }
    }
  }
}