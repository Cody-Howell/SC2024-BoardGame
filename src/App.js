import './App.css';
import React from 'react';
import { Chess } from './Chess.ts';
import { train, initializeModel, playMove } from './model.ts';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkColor: "#666666",
      lightColor: "#dddddd",
      game: new Chess(),
      model: initializeModel()
    }
  }

  updateColor = (value) => {
    let hex = value.target.value;

    let array = hex.split('');
    let red = Number("0x" + (array[1] + array[2])); // Builds as a hex number
    let green = Number("0x" + (array[3] + array[4]));
    let blue = Number("0x" + (array[5] + array[6]));

    red *= 0.66; green *= 0.66; blue *= 0.66;
    red = Number(Math.round(red)).toString(16);
    green = Number(Math.round(green)).toString(16);
    blue = Number(Math.round(blue)).toString(16);

    this.setState({ darkColor: `#${red}${green}${blue}` })
    this.setState({ lightColor: hex })
  }

  clickCoordinates = (x, y) => {
    let game = this.state.game;
    game.clickArea(x, y);
    this.setState({game: game});
  }
  
  // train = async () => {
  //   let model = this.state.model;
  //   await train(model, 50);
  //   // await model.save('localstorage://chess-bot-model');
  //   this.setState({model: model});
  // }

  // download = async () => {
  //   await this.state.model.save('download://chess-bot-model');
  // }

  // playMove = async () => {
  //   let model = this.state.model;
  //   let game = this.state.game;
  //   game = await playMove(model, game);
  //   this.setState({game: game});
  // }
  
  resetGame = () => {
    let game = this.state.game;
    game.resetBoard();
    this.setState({game: game});
  }

  render() {
    let whitePoints = this.state.game.getPoints(true);
    let blackPoints = this.state.game.getPoints(false);

    if (whitePoints >= blackPoints){ 
      whitePoints -= blackPoints;
      blackPoints = 0;
    } else {
      blackPoints -= whitePoints;
      whitePoints = 0;
    }
    let winner = this.state.game.calculateWinner();
    return (
      <div id="App">
        <div id='upperArea'>
          <h1>Chess</h1>
          <div>
            <label htmlFor='lightColor'>Change Board Color: </label>
            <input type='color' name='lightColor' id='lightColor' defaultValue={this.state.lightColor} onChange={this.updateColor} />
          </div>
          <p>Turn: {this.state.game.whiteMove ? "White turn" : "Black turn"} <br/>
            White score: +{whitePoints} | Black score: +{blackPoints} <br/>
            Move: {this.state.game.moveCount} <br/>
            {winner !== null && (<>Winner is: {winner}</>)}
          </p>
          {/* <button onClick={this.train}>Train</button>
          <button onClick={this.download}>Download Bot</button> */}
        </div>
        <ChessBoard 
          lightColor={this.state.lightColor} 
          darkColor={this.state.darkColor} 
          whitePieces={this.state.game.whitePieces}
          blackPieces={this.state.game.blackPieces}
          selectedSquare={this.state.game.selectedSquare}
          possibleMoves={this.state.game.possibleMoves}
          updateGame={this.clickCoordinates}
          />
        <p>Developed by Cody Howell <br/>
          Does not allow for en passant or castling. I wanted to attempt making a bot instead.<br/>
          It didn't work. 
          <button onClick={this.resetGame}>Reset Game</button>
          </p>
      </div>
    );
  }
}

class ChessBoard extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    this.ctx = canvas.getContext('2d');
    this.renderFrame();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) { this.renderFrame(); }
  }

  renderFrame = () => {
    // Clear the canvas
    this.ctx.clearRect(0, 0, 640, 640);

    // Draw chessboard
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        // i = x, j = y
        if (this.props.selectedSquare !== null && 
          this.props.selectedSquare.location.x === i &&
          this.props.selectedSquare.location.y === j) { this.ctx.fillStyle = "#f0c024";}
        else if ((i + j) % 2 === 0) {this.ctx.fillStyle = this.props.darkColor;} 
        else {this.ctx.fillStyle = this.props.lightColor;}

        this.ctx.fillRect(i * 80, (7 - j) * 80, 80, 80);
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "15px Inter";
        this.ctx.fillText(this.coordinateDisplay(i, j), i * 80, (7 - j) * 80 + 15)
      }
    }


    // Draw white pieces
    let whitePieces = this.props.whitePieces;
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = "#fff";
    for (let i = 0; i < whitePieces.length; i++){
      this.drawPiece(whitePieces[i].piece, whitePieces[i].location.x, 7 - whitePieces[i].location.y);
    }
    
    // Draw black pieces
    let blackPieces = this.props.blackPieces;
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = "#000";
    for (let i = 0; i < blackPieces.length; i++){
      this.drawPiece(blackPieces[i].piece, blackPieces[i].location.x, 7 - blackPieces[i].location.y);
    }

    // Draw possible moves
    if (this.props.possibleMoves !== null){
      for (let i = 0; i < this.props.possibleMoves.length; i++){
        this.drawPiece('z', this.props.possibleMoves[i].x, 7 - this.props.possibleMoves[i].y)
      }
    }

  }

  drawPiece = (piece, x, y) => {
    let lowerX = x * 80;
    let lowerY = y * 80;

    this.ctx.beginPath();
    switch (piece) {
      case 'p':
        this.ctx.moveTo(lowerX + 40, lowerY + 70);
        this.ctx.lineTo(lowerX + 20, lowerY + 60);
        this.ctx.quadraticCurveTo(lowerX + 45, lowerY + 30, lowerX + 20, lowerY + 35);
        this.ctx.quadraticCurveTo(lowerX + 40, lowerY + 5, lowerX + 60, lowerY + 35);
        this.ctx.quadraticCurveTo(lowerX + 35, lowerY + 30, lowerX + 60, lowerY + 60);
        break;
      case 'n':
        this.ctx.moveTo(lowerX + 40, lowerY + 70);
        this.ctx.lineTo(lowerX + 20, lowerY + 60);
        this.ctx.quadraticCurveTo(lowerX + 45, lowerY + 30, lowerX + 20, lowerY + 50);
        this.ctx.quadraticCurveTo(lowerX + 20, lowerY + 20, lowerX + 45, lowerY + 20);
        this.ctx.lineTo(lowerX + 50, lowerY + 15);
        this.ctx.lineTo(lowerX + 60, lowerY + 60);
        break;
      case 'b': 
        this.ctx.moveTo(lowerX + 40, lowerY + 70);
        this.ctx.lineTo(lowerX + 20, lowerY + 60);
        this.ctx.lineTo(lowerX + 32, lowerY + 48);
        this.ctx.quadraticCurveTo(lowerX + 20, lowerY + 30, lowerX + 40, lowerY + 15);
        this.ctx.quadraticCurveTo(lowerX + 60, lowerY + 30, lowerX + 48, lowerY + 48);
        this.ctx.lineTo(lowerX + 60, lowerY + 60);
        break;
      case 'q': 
        this.ctx.moveTo(lowerX + 40, lowerY + 70);
        this.ctx.lineTo(lowerX + 20, lowerY + 60);
        this.ctx.lineTo(lowerX + 10, lowerY + 25);
        this.ctx.lineTo(lowerX + 30, lowerY + 50);
        this.ctx.lineTo(lowerX + 40, lowerY + 20);
        this.ctx.lineTo(lowerX + 50, lowerY + 50);
        this.ctx.lineTo(lowerX + 70, lowerY + 25);
        this.ctx.lineTo(lowerX + 60, lowerY + 60);
        break;
      case 'k': // NC
        this.ctx.moveTo(lowerX + 40, lowerY + 70);
        this.ctx.lineTo(lowerX + 20, lowerY + 60);
        this.ctx.lineTo(lowerX + 35, lowerY + 55);
        this.ctx.lineTo(lowerX + 35, lowerY + 42);
        this.ctx.lineTo(lowerX + 20, lowerY + 42);
        this.ctx.lineTo(lowerX + 20, lowerY + 32);
        this.ctx.lineTo(lowerX + 35, lowerY + 32);
        this.ctx.lineTo(lowerX + 35, lowerY + 13);
        this.ctx.lineTo(lowerX + 45, lowerY + 13);
        this.ctx.lineTo(lowerX + 45, lowerY + 32);
        this.ctx.lineTo(lowerX + 60, lowerY + 32);
        this.ctx.lineTo(lowerX + 60, lowerY + 42);
        this.ctx.lineTo(lowerX + 45, lowerY + 42);
        this.ctx.lineTo(lowerX + 45, lowerY + 55);
        this.ctx.lineTo(lowerX + 60, lowerY + 60);
        break;
      case 'r':
        this.ctx.moveTo(lowerX + 40, lowerY + 70);
        this.ctx.lineTo(lowerX + 20, lowerY + 60);
        this.ctx.lineTo(lowerX + 30, lowerY + 50);
        this.ctx.lineTo(lowerX + 33, lowerY + 30);
        this.ctx.lineTo(lowerX + 27, lowerY + 28);
        this.ctx.lineTo(lowerX + 27, lowerY + 18);
        this.ctx.lineTo(lowerX + 30, lowerY + 18);
        this.ctx.lineTo(lowerX + 30, lowerY + 25);
        this.ctx.lineTo(lowerX + 38, lowerY + 25);
        this.ctx.lineTo(lowerX + 38, lowerY + 18);
        this.ctx.lineTo(lowerX + 42, lowerY + 18);
        this.ctx.lineTo(lowerX + 42, lowerY + 25);
        this.ctx.lineTo(lowerX + 50, lowerY + 25);
        this.ctx.lineTo(lowerX + 50, lowerY + 18);
        this.ctx.lineTo(lowerX + 53, lowerY + 18);
        this.ctx.lineTo(lowerX + 53, lowerY + 28);
        this.ctx.lineTo(lowerX + 47, lowerY + 30);
        this.ctx.lineTo(lowerX + 50, lowerY + 50);
        this.ctx.lineTo(lowerX + 60, lowerY + 60);
        break;
      case 'z': // Possible move display
        const gradient = this.ctx.createRadialGradient(lowerX + 40, lowerY + 40, 1, lowerX + 40, lowerY + 40, 38);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(1, "transparent");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(lowerX, lowerY, 80, 80);
        break;
      default: throw Error("drawPiece took in an unknown piece.");
    }

    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  coordinateDisplay = (x, y) => {
    let string = "";
    switch (x) {
      case 0: string += "a"; break;
      case 1: string += "b"; break;
      case 2: string += "c"; break;
      case 3: string += "d"; break;
      case 4: string += "e"; break;
      case 5: string += "f"; break;
      case 6: string += "g"; break;
      default: string += "h"; break;
    }
    string += y + 1;
    return string;
  }

  clickGame = (x, y) => {
    this.props.updateGame(x, y);
  }

  render() {
    // Create div for coordinates
    let buttons = [];
    for (let i = 7; i >= 0; i--) {
      for (let j = 0; j < 8; j++) { // Some fanagaling to get the correct orientation
        buttons.push(<div onClick={() => this.clickGame(j, i)} key={`${i} ${j}`}></div>)
      }
    }
    return (
      <div id='chessboard'>
        <canvas
          id='nextBox'
          ref={this.canvasRef}
          width={640}
          height={640}
          style={{ border: '1px solid black', borderRadius: '3px' }}
        />
        <div id='buttons'>
          {buttons}
        </div>
      </div>
    )
  }
}

export default App;
