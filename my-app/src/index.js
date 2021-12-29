import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props){
    return (
      <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

  class Board extends React.Component {
    renderSquare(i) {
      return (
                <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}  
                />
      );
    }
    render() {
      const squareIndex = [ 1, 2, 3];
      return (
        <>
         {[...Array(3)].map((x, i) =>
          <div className="board-row" key={i}>
            {[...Array(3)].map((x2, i2) =>
              <Square 
                key={i * 3 + i2} 
                value={this.props.squares[i * 3 + i2]}
                onClick={() => this.props.onClick(i * 3 + i2)}  
              />
            )}
          </div>
          )}
        </>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          location: Array(2).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0,
        isAsc: true,
      };
    }
    
    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const location = current.location.slice();

      if (calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      location[0] = i % 3;
      location[1] = (i < 3) ? 2 : (i < 6) ? 1 : 0;

      this.setState({
        history: history.concat([{
          squares: squares,
          location: location,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          "Go to move #" + move + " location: " + step.location:
          "Go to game start";
          return (
            <li key={move}>
              <button
                className={(this.state.stepNumber == move) ? 'text-bold' : ''} 
                onClick={() => this.jumpTo(move)}
              >
                {desc}
              </button>
            </li>
          );
      }); 
      
      const movesDesc = [].concat(history)
        .sort((a, b) => a.itemM > b.itemM ? 1 : -1)
        .map((step, move) => {
        const descMove = this.state.stepNumber - move;
        const count = history.length - move;
        const desc = count !== 1 ?
          "Go to move #" + (count - 1) + " location: " + step.location:
          "Go to game start";
          return (
            <li key={move}>
              <button
                className={(this.state.stepNumber == (count - 1)) ? 'text-bold' : ''} 
                onClick={() => this.jumpTo(count - 1)}
              >
                {desc}
              </button>
            </li>
          )}
      );


      let status;
      if(winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>
              <button onClick={() => this.setState({isAsc: !this.state.isAsc})}>Sort</button>
            </ol>
            <ol>{(this.state.isAsc) ? moves : movesDesc}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares){
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for(let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  