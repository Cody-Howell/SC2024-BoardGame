export class Chess {
  whitePieces: Array<Piece>;
  blackPieces: Array<Piece>;
  selectedSquare: Piece | null; // Tied with possibleMoves, if there is a piece on the square, show where it can move.
  possibleMoves: Array<Square> | null;
  whiteMove: boolean; // If it's white's turn, mark as true.
  moveCount: number;
  previousMove: Square;


  constructor() {
    this.whitePieces = [];
    this.blackPieces = [];
    this.selectedSquare = null;
    this.possibleMoves = null;
    this.whiteMove = true;
    this.moveCount = 0;
    this.resetBoard();
  }

  resetBoard() {
    this.whitePieces = [];
    this.blackPieces = [];
    this.moveCount = 0;
    this.whitePieces.push({ piece: 'k', location: { x: 4, y: 0 } });
    this.blackPieces.push({ piece: 'k', location: { x: 4, y: 7 } });
    this.whitePieces.push({ piece: 'q', location: { x: 3, y: 0 } });
    this.blackPieces.push({ piece: 'q', location: { x: 3, y: 7 } });
    this.whitePieces.push({ piece: 'b', location: { x: 2, y: 0 } });
    this.whitePieces.push({ piece: 'b', location: { x: 5, y: 0 } });
    this.blackPieces.push({ piece: 'b', location: { x: 2, y: 7 } });
    this.blackPieces.push({ piece: 'b', location: { x: 5, y: 7 } });
    this.whitePieces.push({ piece: 'n', location: { x: 1, y: 0 } });
    this.whitePieces.push({ piece: 'n', location: { x: 6, y: 0 } });
    this.blackPieces.push({ piece: 'n', location: { x: 1, y: 7 } });
    this.blackPieces.push({ piece: 'n', location: { x: 6, y: 7 } });
    this.whitePieces.push({ piece: 'r', location: { x: 0, y: 0 } });
    this.whitePieces.push({ piece: 'r', location: { x: 7, y: 0 } });
    this.blackPieces.push({ piece: 'r', location: { x: 0, y: 7 } });
    this.blackPieces.push({ piece: 'r', location: { x: 7, y: 7 } });
    this.whitePieces.push({ piece: 'p', location: { x: 0, y: 1 } });
    this.whitePieces.push({ piece: 'p', location: { x: 1, y: 1 } });
    this.whitePieces.push({ piece: 'p', location: { x: 2, y: 1 } });
    this.whitePieces.push({ piece: 'p', location: { x: 3, y: 1 } });
    this.whitePieces.push({ piece: 'p', location: { x: 4, y: 1 } });
    this.whitePieces.push({ piece: 'p', location: { x: 5, y: 1 } });
    this.whitePieces.push({ piece: 'p', location: { x: 6, y: 1 } });
    this.whitePieces.push({ piece: 'p', location: { x: 7, y: 1 } });
    this.blackPieces.push({ piece: 'p', location: { x: 0, y: 6 } });
    this.blackPieces.push({ piece: 'p', location: { x: 1, y: 6 } });
    this.blackPieces.push({ piece: 'p', location: { x: 2, y: 6 } });
    this.blackPieces.push({ piece: 'p', location: { x: 3, y: 6 } });
    this.blackPieces.push({ piece: 'p', location: { x: 4, y: 6 } });
    this.blackPieces.push({ piece: 'p', location: { x: 5, y: 6 } });
    this.blackPieces.push({ piece: 'p', location: { x: 6, y: 6 } });
    this.blackPieces.push({ piece: 'p', location: { x: 7, y: 6 } });
  }

  clickArea(x: BoardCoord, y: BoardCoord) {
    if (this.selectedSquare !== null) {
      let value = this.checkSelectedSquare(x!, y!);
      if (this.checkPossibleMoves({ x: x, y: y })) {
        let pieceIndex = this.checkSelectedSquare(this.selectedSquare.location.x!, this.selectedSquare.location.y!);
        this.performMove(pieceIndex!.index, { x: x, y: y });
        this.possibleMoves = null;
        this.selectedSquare = null;
        this.whiteMove = !this.whiteMove;
      } else if (value !== null) {
        this.selectedSquare = value.piece;
        if (value.white === this.whiteMove) {
          this.possibleMoves = this.calculatePossibleMoves(value.piece, this.whiteMove, false);
        } else {
          this.possibleMoves = null;
        }
      } else { // Clicked on an empty sqaure
        this.selectedSquare = null;
        this.possibleMoves = null;
      }
    } else {
      let value = this.checkSelectedSquare(x!, y!);
      if (value !== null) {
        this.selectedSquare = value.piece;
        if (value.white === this.whiteMove) {
          this.possibleMoves = this.calculatePossibleMoves(value.piece, this.whiteMove, false);
        } else {
          this.possibleMoves = null;
        }
      }
    }
    if (this.whiteMove) { this.moveCount++; }
  }

  performMove(pieceIndex: number, to: Square) {
    let capturePiece = this.checkSelectedSquare(to.x!, to.y!);
    if (this.whiteMove) {
      this.whitePieces[pieceIndex].location.x = to.x;
      this.whitePieces[pieceIndex].location.y = to.y;
      if (capturePiece !== null) {
        this.blackPieces.splice(capturePiece.index, 1);
      }
    } else {
      this.blackPieces[pieceIndex].location.x = to.x;
      this.blackPieces[pieceIndex].location.y = to.y;
      if (capturePiece !== null) {
        this.whitePieces.splice(capturePiece.index, 1);
      }
    }
    this.previousMove = to;
  }

  checkPossibleMoves(spot: Square): boolean {
    // Hard-coded lookup for possible moves
    if (this.possibleMoves !== null) {
      for (let i = 0; i < this.possibleMoves?.length; i++) {
        if (this.possibleMoves[i].x === spot.x &&
          this.possibleMoves[i].y === spot.y) {
          return true;
        }
      }
    }
    return false;
  }

  checkSelectedSquare(x: number, y: number): { piece: Piece, white: boolean, index: number } | null {
    // Check white pieces
    for (let i = 0; i < this.whitePieces.length; i++) {
      if (this.whitePieces[i].location.x === x && this.whitePieces[i].location.y === y) {
        return { piece: this.whitePieces[i], white: true, index: i };
      }
    }

    // Check black pieces
    for (let i = 0; i < this.blackPieces.length; i++) {
      if (this.blackPieces[i].location.x === x && this.blackPieces[i].location.y === y) {
        return { piece: this.blackPieces[i], white: false, index: i };
      }
    }
    return null;
  }

  calculatePossibleMoves(piece: Piece, whiteTurn: boolean, secondOrder: boolean): Array<Square> {
    // Returns possible moves
    let array: Array<Square> = [];
    switch (piece.piece) {
      case 'p':
        if (whiteTurn) {
          let testSquare1: Square = { x: piece.location.x, y: addCoord(piece.location.y, 1) }
          let square2 = this.checkSelectedSquare(testSquare1.x!, testSquare1.y!);
          if (square2 === null) {
            array.push(testSquare1);
          }
          if (piece.location.y === 1) {
            let testSquare2: Square = { x: piece.location.x, y: addCoord(piece.location.y, 2) }
            if (square2 === null && this.checkSelectedSquare(testSquare1.x!, testSquare1.y!) === null) {
              array.push(testSquare2);
            }
          }
          // Check corner captures
          let testSquare3: Square = { x: addCoord(piece.location.x, 1), y: addCoord(piece.location.y, 1) }
          let square3 = this.checkSelectedSquare(testSquare3.x!, testSquare3.y!);
          let testSquare4: Square = { x: addCoord(piece.location.x, -1), y: addCoord(piece.location.y, 1) }
          let square4 = this.checkSelectedSquare(testSquare4.x!, testSquare4.y!);
          if (square3 !== null && !square3.white) { array.push(testSquare3); }
          if (square4 !== null && !square4.white) { array.push(testSquare4); }
        }
        else {
          let testSquare1: Square = { x: piece.location.x, y: addCoord(piece.location.y, -1) }
          let square2 = this.checkSelectedSquare(testSquare1.x!, testSquare1.y!);
          if (square2 === null) {
            array.push(testSquare1);
          }
          if (piece.location.y === 6) {
            let testSquare2: Square = { x: piece.location.x, y: addCoord(piece.location.y, -2) }
            if (square2 === null && this.checkSelectedSquare(testSquare1.x!, testSquare1.y!) === null) {
              array.push(testSquare2);
            }
          }
          // Check corner captures
          let testSquare3: Square = { x: addCoord(piece.location.x, 1), y: addCoord(piece.location.y, -1) }
          let square3 = this.checkSelectedSquare(testSquare3.x!, testSquare3.y!);
          let testSquare4: Square = { x: addCoord(piece.location.x, -1), y: addCoord(piece.location.y, -1) }
          let square4 = this.checkSelectedSquare(testSquare4.x!, testSquare4.y!);
          if (square3 !== null && square3.white) { array.push(testSquare3); }
          if (square4 !== null && square4.white) { array.push(testSquare4); }
        }

        break;
      case 'n':
        const arrayCheck: Array<Array<number>> = [[1, 2], [1, -2], [2, 1], [2, -1],
        [-1, 2], [-1, -2], [-2, 1], [-2, -1]]
        for (let check of arrayCheck) {
          let possibleSquare: Square = { x: addCoord(piece.location.x, check[0]), y: addCoord(piece.location.y, check[1]) };
          if (possibleSquare.x === null || possibleSquare.y === null) { continue; }
          let testPiece = this.checkSelectedSquare(possibleSquare.x, possibleSquare.y);
          if (testPiece === null) {
            // Empty square
            array.push(possibleSquare);
          } else {
            if (testPiece.white === whiteTurn) { continue; } // Piece is of the same color
            array.push(possibleSquare);
          }
        }
        break;
      case 'b':
        for (let i = 0; i <= 3; i++) {
          let addition = i.toString(2).padStart(2).split("");
          let xMultiply = addition[0] === "1" ? -1 : 1; // Really didn't believe it when ChatGPT spat back the exact syntax I asked existed
          let yMultiply = addition[1] === "1" ? -1 : 1;
          for (let i = 1; i < 8; i++) {
            let possibleSquare: Square = { x: addCoord(piece.location.x, i * xMultiply), y: addCoord(piece.location.y, i * yMultiply) };
            if (possibleSquare.x === null || possibleSquare.y === null) { break; }
            let testPiece = this.checkSelectedSquare(possibleSquare.x, possibleSquare.y);
            if (testPiece !== null){
              if (testPiece.white === whiteTurn) {
                break; // Same color
              } else {
                array.push(possibleSquare);
                break; // Different color, but not x-ray
              }
            }
            // Square is open
            array.push(possibleSquare);
          }
        }
        break;
      case 'r':
        let directions: Array<Array<number>> = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        for (let i = 0; i <= 3; i++) {
          let xMultiply = directions[i][0]; 
          let yMultiply = directions[i][1];
          for (let i = 1; i < 8; i++) {
            let possibleSquare: Square = { x: addCoord(piece.location.x, i * xMultiply), y: addCoord(piece.location.y, i * yMultiply) };
            if (possibleSquare.x === null || possibleSquare.y === null) { break; }
            let testPiece = this.checkSelectedSquare(possibleSquare.x, possibleSquare.y);
            if (testPiece !== null) {
              if (testPiece.white === whiteTurn) {
                break; // Same color
              } else {
                array.push(possibleSquare);
                break; // Different color, but not x-ray
              }
            }
            // Square is open
            array.push(possibleSquare);
          }
        }
        break;
      case 'q':
        // Rook checks
        let queenDirections: Array<Array<number>> = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Already defined, apparently?
        for (let i = 0; i <= 3; i++) {
          let xMultiply = queenDirections[i][0];
          let yMultiply = queenDirections[i][1];
          for (let i = 1; i < 8; i++) {
            let possibleSquare: Square = { x: addCoord(piece.location.x, i * xMultiply), y: addCoord(piece.location.y, i * yMultiply) };
            if (possibleSquare.x === null || possibleSquare.y === null) { break; }
            let testPiece = this.checkSelectedSquare(possibleSquare.x, possibleSquare.y);
            if (testPiece !== null) {
              if (testPiece.white === whiteTurn) {
                break; // Same color
              } else {
                array.push(possibleSquare);
                break; // Different color, but not x-ray
              }
            }
            // Square is open
            array.push(possibleSquare);
          }
        }
        // Bishop checks
        for (let i = 0; i <= 3; i++) {
          let addition = i.toString(2).padStart(2).split("");
          let xMultiply = addition[0] === "1" ? -1 : 1; // Really didn't believe it when ChatGPT spat back the exact syntax I asked existed
          let yMultiply = addition[1] === "1" ? -1 : 1;
          for (let i = 1; i < 8; i++) {
            let possibleSquare: Square = { x: addCoord(piece.location.x, i * xMultiply), y: addCoord(piece.location.y, i * yMultiply) };
            if (possibleSquare.x === null || possibleSquare.y === null) { break; }
            let testPiece = this.checkSelectedSquare(possibleSquare.x, possibleSquare.y);
            if (testPiece !== null) {
              if (testPiece.white === whiteTurn) {
                break; // Same color
              } else {
                array.push(possibleSquare);
                break; // Different color, but not x-ray
              }
            }
            // Square is open
            array.push(possibleSquare);
          }
        }
        break;
      case 'k':
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) { continue; }
            let possibleSquare: Square = { x: addCoord(piece.location.x, i), y: addCoord(piece.location.y, j) };
            if (possibleSquare.x === null || possibleSquare.y === null) { continue; }
            let testPiece = this.checkSelectedSquare(possibleSquare.x, possibleSquare.y);
            if (testPiece !== null) {
              if (testPiece.white !== whiteTurn) {
                array.push(possibleSquare);
              }
            } else {
              // Square is open
              array.push(possibleSquare);
            }
          }
        }
        break;
    }

    if (!secondOrder) {
      // Calculate checks here and remove invalid moves
      // Done here to simplify earlier, and since I was getting infinite recursion
      let currentPiece = this.checkSelectedSquare(piece.location.x!, piece.location.y!);
      for (let i = 0; i < array.length; i++){
        let possibleCapture = this.checkSelectedSquare(array[i].x!, array[i].y!) === null ? false : true;
        if (this.calculateCheck(currentPiece?.index!, array[i], possibleCapture)){
          array.splice(i, 1);
          i--;
        }
      }
    }

    return array;
  }

  calculateCheck(index: number, to: Square, capture: boolean): boolean {
    // Takes an index, uses the current move, stores its location, moves it to a new location, and sees if the king is still in check. 
    // MAKE SURE TO REVERT PIECE
    let oldLocation: Square;
    let piece: { piece: Piece, white: boolean, index: number } | null = null;
    if (this.whiteMove) {
      if (capture) {
        piece = this.checkSelectedSquare(to.x!, to.y!);
        if (piece !== null) {
          this.blackPieces.splice(piece?.index!, 1);
        }
      }
      oldLocation = this.whitePieces[index].location;
      this.whitePieces[index].location = to;
    } else {
      if (capture) {
        piece = this.checkSelectedSquare(to.x!, to.y!);
        if (piece !== null) {
          this.whitePieces.splice(piece?.index!, 1);
        }
      }
      oldLocation = this.blackPieces[index].location;
      this.blackPieces[index].location = to;
    }

    let value: boolean = false;
    try {
      value = this.isKingInCheck();
    } finally { // I very much think this is overkill
      if (this.whiteMove) { this.whitePieces[index].location = oldLocation; }
      else { this.blackPieces[index].location = oldLocation; }

      if (capture && piece !== null) {
        if (this.whiteMove) {
          this.blackPieces.push(piece?.piece!);
        } else {
          this.whitePieces.push(piece?.piece!);
        }
      }
    }

    if (value) { return true; }
    return false;
  }

  isKingInCheck(): boolean {
    // Using the current turn and all the pieces, check if the king is in check
    if (this.whiteMove) {
      let kingPosition: Square = this.getKingSquare(true);
      for (let i = 0; i < this.blackPieces.length; i++) {
        let possibleMoves = this.calculatePossibleMoves(this.blackPieces[i], false, true);
        for (let move of possibleMoves) {
          if (move.x === kingPosition.x && move.y === kingPosition.y) {
            return true;
          }
        }
      }
    } else {
      let kingPosition: Square = this.getKingSquare(false);
      for (let i = 0; i < this.whitePieces.length; i++) {
        let possibleMoves = this.calculatePossibleMoves(this.whitePieces[i], true, true);
        for (let move of possibleMoves) {
          if (move.x === kingPosition.x && move.y === kingPosition.y) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getKingSquare(whiteTurn: boolean): Square {
    if (whiteTurn) {
      for (let i = 0; i < this.whitePieces.length; i++) {
        if (this.whitePieces[i].piece === 'k') {
          return this.whitePieces[i].location;
        }
      }
    } else {
      for (let i = 0; i < this.blackPieces.length; i++) {
        if (this.blackPieces[i].piece === 'k') {
          return this.blackPieces[i].location;
        }
      }
    }
    throw new Error("Couldn't find king");
  }

  getPoints(whiteTurn: boolean): number {
    let number = 0;
    if (whiteTurn) {
      for (let i = 0; i < this.whitePieces.length; i++) {
        number += pointSystem(this.whitePieces[i].piece);
      }
    } else {
      for (let i = 0; i < this.blackPieces.length; i++) {
        number += pointSystem(this.blackPieces[i].piece);
      }
    }
    return number;
  }

  calculateWinner(): GameWinner {
    if (this.whiteMove){
      for (let i = 0; i < this.whitePieces.length; i++){
        let array = this.calculatePossibleMoves(this.whitePieces[i], true, false);
        if (array.length !== 0) { return null; }
      }
      return 'black';
    } else {
      for (let i = 0; i < this.blackPieces.length; i++){
        let array = this.calculatePossibleMoves(this.blackPieces[i], false, false);
        if (array.length !== 0) { return null; }
      }
      return 'white';
    }
  }
}

type Piece = {
  piece: PieceChar;
  location: Square;
}

type Square = {
  x: BoardCoord;
  y: BoardCoord;
}

// I never knew this type specification would be so useful! 
type PieceChar = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
type BoardCoord = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
type GameWinner = 'black' | 'white' | null;

// *sigh* I'd rather not this exist. 
function addCoord(coord: BoardCoord, increment: number): BoardCoord {
  if (coord !== null) {
    const result = coord + increment;
    // Check if the result is within the BoardCoord range
    if (result >= 0 && result <= 7) {
      return result as BoardCoord;
    } else {
      return null as BoardCoord;
    }
  }
  return null as BoardCoord;
}

function pointSystem(piece: PieceChar): number {
  switch (piece) {
    case 'k': return 0;
    case 'q': return 9;
    case 'r': return 5;
    case 'b': return 3;
    case 'n': return 3;
    case 'p': return 1;
  }
}