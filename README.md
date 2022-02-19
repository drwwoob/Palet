![IMG_4B990C7F236E-1](https://user-images.githubusercontent.com/20586059/154793393-92ae3773-4453-4384-8395-cb1b40f4d050.png)

### Palet is a color-based assembly-level language inspired by Piet, which reads image files pixel-by-pixel.

```
- Palet’s register-based architecture allows it to support user-defined color meanings from a preset list\
- With maximum-precision color detection, a single Palet program can use as many as 2796202 different registers.\
- Unlike Piet, Palet does not distinguish between small and large patches of the same color.\
  Every rectangular, pixel-based image is a syntactically valid Palet program.

```

## It’s time to be CREATIVE!

### Lexer Breakdown:

```
The lexer currently takes a .pal file. These files are stand-ins for a sequence of colors that the final version of Palet will read, left to right, from a png.

Any number of adjacent pixels in a png with the same RGB value will be considered a Palet token. Two tokens of the same RGB value must be separated completely by another token for Palete to distinguish them. Two pixels connected at a corner are not considered adjacent. Tokens completely surrounded on all sides by one larger token will not be read, and can be used to write comments or add visual flair.
```

![IMG_4B990C7F236E-1](https://user-images.githubusercontent.com/20586059/154793314-0cf012aa-212b-4c30-a13a-955771982a45.png)

## Parser Breakdown:

```
_Palettes_ are a series of 2 to 5 RBG values (swatches) associated with a register. This register defaults to zero upon declaration. All swatches in a palette are aliases for a pointer to the palette’s register.

The specific aliases used in a program, along with their order and number, change the meaning of each expression.
```

![IMG_4B990C7F236E-1](https://user-images.githubusercontent.com/20586059/154793318-0f39565b-bab6-405d-bcd7-609b0e093356.jpg)

## Examples:

![IMG_4B990C7F236E-1](https://user-images.githubusercontent.com/20586059/154793315-b331e75d-a37d-4bfe-ab20-5f9313b19a47.jpg)
![IMG_4B990C7F236E-1](https://user-images.githubusercontent.com/20586059/154793317-bbaf30ac-20b9-4c3f-abb0-eecf55f82884.jpg)
