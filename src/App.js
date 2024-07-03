import logo from './logo.svg';
import './App.css';
import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div id="App">
        <h1>Chess</h1>
        <ChessBoard />
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
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) { this.renderFrame(); }
  }

  renderFrame = () => {
    // Clear the canvas
    this.ctx.clearRect(0, 0, 700, 700);

    this.ctx.font = "15px Inter";
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText("Held", 110, 30);

    // Print held item
    this.drawItem(this.props.held, 80, 60);

    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 140, 250, 1);
    this.ctx.fillText("Queue", 102, 160);

    // Print queue
    let queue = this.props.queue;
    if (queue) {
      for (let i = 0; i < queue.length; i++) {
        this.drawItem(queue[i], 80, 190 + (i * 85));
      }
    }
  }

  render() {
    return (
      <div id='chessboard'>
        <canvas
          id='nextBox'
          ref={this.canvasRef}
          width={700}
          height={700}
          style={{ border: '1px solid black' }}
        />
      </div>
    )
  }
}

export default App;
