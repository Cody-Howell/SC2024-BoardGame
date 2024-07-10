export class Chess {
  whitePieces: Array<Piece>;
  blackPieces: Array<Piece>;
  selectedSquare: Piece | null; // Tied with possibleMoves, if there is a piece on the square, show where it can move.
  possibleMoves: Array<Square> | null;
  whiteMove: boolean; // If it's white's turn, mark as true.
  moveCount: number;


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
    this.whitePieces.push({ piece: 'p', location: { x: 4, y: 2 } });
    this.whitePieces.push({ piece: 'k', location: { x: 6, y: 0 } });
    this.blackPieces.push({ piece: 'p', location: { x: 5, y: 6 } });
    this.blackPieces.push({ piece: 'b', location: { x: 1, y: 5 } });
    this.blackPieces.push({ piece: 'k', location: { x: 0, y: 7 } });
    // this.whitePieces.push({piece: 'k', location: {x: 4, y: 0}});  
    // this.blackPieces.push({piece: 'k', location: {x: 4, y: 7}});  
    // this.whitePieces.push({piece: 'q', location: {x: 3, y: 0}});  
    // this.blackPieces.push({piece: 'q', location: {x: 3, y: 7}});  
    // this.whitePieces.push({piece: 'b', location: {x: 2, y: 0}});  
    // this.whitePieces.push({piece: 'b', location: {x: 5, y: 0}});  
    // this.blackPieces.push({piece: 'b', location: {x: 2, y: 7}});  
    // this.blackPieces.push({piece: 'b', location: {x: 5, y: 7}});  
    // this.whitePieces.push({piece: 'n', location: {x: 1, y: 0}});  
    // this.whitePieces.push({piece: 'n', location: {x: 6, y: 0}});  
    // this.blackPieces.push({piece: 'n', location: {x: 1, y: 7}});  
    // this.blackPieces.push({piece: 'n', location: {x: 6, y: 7}});  
    // this.whitePieces.push({piece: 'r', location: {x: 0, y: 0}});  
    // this.whitePieces.push({piece: 'r', location: {x: 7, y: 0}});  
    // this.blackPieces.push({piece: 'r', location: {x: 0, y: 7}});  
    // this.blackPieces.push({piece: 'r', location: {x: 7, y: 7}});  
    // this.whitePieces.push({piece: 'p', location: {x: 0, y: 1}});  
    // this.whitePieces.push({piece: 'p', location: {x: 1, y: 1}});  
    // this.whitePieces.push({piece: 'p', location: {x: 2, y: 1}});  
    // this.whitePieces.push({piece: 'p', location: {x: 3, y: 1}});  
    // this.whitePieces.push({piece: 'p', location: {x: 4, y: 1}});  
    // this.whitePieces.push({piece: 'p', location: {x: 5, y: 1}});  
    // this.whitePieces.push({piece: 'p', location: {x: 6, y: 1}});  
    // this.whitePieces.push({piece: 'p', location: {x: 7, y: 1}});  
    // this.blackPieces.push({piece: 'p', location: {x: 0, y: 6}});  
    // this.blackPieces.push({piece: 'p', location: {x: 1, y: 6}});  
    // this.blackPieces.push({piece: 'p', location: {x: 2, y: 6}});  
    // this.blackPieces.push({piece: 'p', location: {x: 3, y: 6}});  
    // this.blackPieces.push({piece: 'p', location: {x: 4, y: 6}});  
    // this.blackPieces.push({piece: 'p', location: {x: 5, y: 6}});  
    // this.blackPieces.push({piece: 'p', location: {x: 6, y: 6}});  
    // this.blackPieces.push({piece: 'p', location: {x: 7, y: 6}});  
  }

  clickArea(x: BoardCoord, y: BoardCoord) {
    // console.log("Top of Click Area method --------------------");
    // console.log(`X: ${x}, Y:${y}`);
    // console.log("Possible Moves: ");
    // console.log(this.possibleMoves);

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
          this.possibleMoves = this.calculatePossibleMoves(value.piece, this.whiteMove);
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
          this.possibleMoves = this.calculatePossibleMoves(value.piece, this.whiteMove);
        } else {
          this.possibleMoves = null;
        }
      }
    }
    this.moveCount++;
  }

  performMove(pieceIndex: number, to: Square) {
    if (this.whiteMove) {
      this.whitePieces[pieceIndex].location.x = to.x;
      this.whitePieces[pieceIndex].location.y = to.y;
    } else {
      this.blackPieces[pieceIndex].location.x = to.x;
      this.blackPieces[pieceIndex].location.y = to.y;
    }
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

  calculatePossibleMoves(piece: Piece, whiteTurn: boolean): Array<Square> {
    // Returns possible moves
    let array: Array<Square> = [];
    let checkPiece = this.checkSelectedSquare(this.selectedSquare?.location.x!, this.selectedSquare?.location.y!);
    switch (piece.piece) {
      case 'p':
        if (whiteTurn) {
          let testSquare1: Square = { x: piece.location.x, y: addCoord(piece.location.y, 1) }
          if (this.checkSelectedSquare(testSquare1.x!, testSquare1.y!) === null && !this.calculateCheck(checkPiece?.index!, testSquare1)) {
            array.push(testSquare1);
          }
          if (piece.location.y === 1) {
            let testSquare2: Square = { x: piece.location.x, y: addCoord(piece.location.y, 2) }
            if (this.checkSelectedSquare(testSquare1.x!, testSquare1.y!) === null && !this.calculateCheck(checkPiece?.index!, testSquare2)) {
              array.push(testSquare2);
            }
          }
        }
        else {
          let testSquare1: Square = { x: piece.location.x, y: addCoord(piece.location.y, -1) }
          if (this.checkSelectedSquare(testSquare1.x!, testSquare1.y!) === null && !this.calculateCheck(checkPiece?.index!, testSquare1)) {
            array.push(testSquare1);
          }
          if (piece.location.y === 6) {
            let testSquare2: Square = { x: piece.location.x, y: addCoord(piece.location.y, -2) }
            if (this.checkSelectedSquare(testSquare1.x!, testSquare1.y!) === null && !this.calculateCheck(checkPiece?.index!, testSquare2)) {
              array.push(testSquare2);
            }
          }
        }

        // Check corner captures
        break;
      case 'n':
        const arrayCheck: Array<Array<number>> = [[1, 2], [1, -2], [2, 1], [2, -1],
        [-1, 2], [-1, -2], [-2, 1], [-2, -1]]
        for (let check of arrayCheck) {
          let possibleSquare: Square = { x: addCoord(piece.location.x, check[0]), y: addCoord(piece.location.y, check[1]) };
          if (possibleSquare.x === null || possibleSquare.y === null) { continue; }
          // Check here for other pieces and checks
          array.push(possibleSquare);
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
            // Check here for other pieces and checks
            array.push(possibleSquare);
          }
        }
        break;
      case 'r':
        let originalX = Number(piece.location.x);
        let originalY = Number(piece.location.y);
        for (let i = originalX + 1; i < 8; i++) { // To the right
          let possibleSquare: Square = { x: i as BoardCoord, y: originalY as BoardCoord };
          if (possibleSquare.x === null || possibleSquare.y === null) { continue; }
          // Check here for other pieces and checks
          array.push(possibleSquare);
        }
        for (let i = originalX - 1; i >= 0; i--) { // To the left
          let possibleSquare: Square = { x: i as BoardCoord, y: originalY as BoardCoord };
          if (possibleSquare.x === null || possibleSquare.y === null) { continue; }
          // Check here for other pieces and checks
          array.push(possibleSquare);
        }
        for (let i = originalY + 1; i < 8; i++) { // Above
          let possibleSquare: Square = { x: originalX as BoardCoord, y: i as BoardCoord };
          if (possibleSquare.x === null || possibleSquare.y === null) { continue; }
          // Check here for other pieces and checks
          array.push(possibleSquare);
        }
        for (let i = originalY - 1; i >= 0; i--) { // Below
          let possibleSquare: Square = { x: originalX as BoardCoord, y: i as BoardCoord };
          if (possibleSquare.x === null || possibleSquare.y === null) { continue; }
          // Check here for other pieces and checks
          array.push(possibleSquare);
        }
        break;
      case 'q':

        break;
      case 'k':
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) { continue; }
            let possibleSquare: Square = { x: addCoord(piece.location.x, i), y: addCoord(piece.location.y, j) };
            if (possibleSquare.x === null || possibleSquare.y === null) { continue; }
            // Still need to check for pieces in this area, and checks...
            array.push(possibleSquare);
          }
        }
        break;
      default:
        throw Error("Invalid piece to move-check.");
    }
    return array;
  }

  calculateCheck(index: number, to: Square): boolean {
    // Takes an index, uses the current move, stores its location, moves it to a new location, and sees if the king is still in check. 
    // MAKE SURE TO REVERT PIECE
    let oldLocation: Square | undefined = undefined;
    if (this.whiteMove) {
      oldLocation = this.whitePieces[index].location;
      this.whitePieces[index].location = to;
    } else {
      oldLocation = this.blackPieces[index].location;
      this.blackPieces[index].location = to;
    }

    let value: boolean = false;
    try {
      value = this.isKingInCheck();
    } finally { // I very much doubt this is overkill
      if (this.whiteMove) { this.whitePieces[index].location = oldLocation; }
      else { this.blackPieces[index].location = oldLocation; }
    }

    if (value) { return true; }
    return false;
  }

  isKingInCheck(): boolean {
    // Using the current turn and all the pieces, check if the king is in check
    if (this.whiteMove) {
      let kingPosition: Square = this.getKingSquare(true);
      for (let i = 0; i < this.blackPieces.length; i++) {
        let possibleMoves = this.calculatePossibleMoves(this.blackPieces[i], true);
        for (let move of possibleMoves) {
          if (move.x === kingPosition.x && move.y === kingPosition.y) {
            return true;
          }
        }
      }
    } else {
      let kingPosition: Square = this.getKingSquare(false);
      for (let i = 0; i < this.whitePieces.length; i++) {
        let possibleMoves = this.calculatePossibleMoves(this.whitePieces[i], false);
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