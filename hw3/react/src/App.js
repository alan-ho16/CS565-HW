import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const ROWS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

function calculateWinner(squares) {
  const winningLine = LINES.find(
    ([a, b, c]) =>
      squares[a] && squares[a] === squares[b] && squares[a] === squares[c],
  );
  return winningLine ? squares[winningLine[0]] : null;
}

function Square({ index, value, onClick }) {
  const handleClick = useCallback(() => {
    onClick(index);
  }, [index, onClick]);

  return (
    <button type="button" className="square" onClick={handleClick}>
      {value}
    </button>
  );
}

Square.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Square.defaultProps = {
  value: null,
};

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const nextPlayer = xIsNext ? 'X' : 'O';
  const status = winner ? `Winner: ${winner}` : `Next player: ${nextPlayer}`;

  const handleSquareClick = useCallback(
    (i) => {
      if (winner || squares[i]) {
        return;
      }
      const nextSquares = [...squares];
      nextSquares[i] = nextPlayer;
      onPlay(nextSquares);
    },
    [nextPlayer, onPlay, squares, winner],
  );

  return (
    <>
      <div className="status">{status}</div>
      {ROWS.map((row) => (
        <div className="board-row" key={row[0]}>
          {row.map((i) => (
            <Square
              key={i}
              index={i}
              value={squares[i]}
              onClick={handleSquareClick}
            />
          ))}
        </div>
      ))}
    </>
  );
}

Board.propTypes = {
  xIsNext: PropTypes.bool.isRequired,
  squares: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPlay: PropTypes.func.isRequired,
};

function MoveItem({ id, onJumpTo }) {
  const description = id > 0 ? `Go to move #${id}` : 'Go to game start';

  const handleClick = useCallback(() => {
    onJumpTo(id);
  }, [id, onJumpTo]);

  return (
    <li>
      <button type="button" onClick={handleClick}>
        {description}
      </button>
    </li>
  );
}

MoveItem.propTypes = {
  id: PropTypes.number.isRequired,
  onJumpTo: PropTypes.func.isRequired,
};

export default function Game() {
  const [history, setHistory] = useState([
    { id: 0, squares: Array(9).fill(null) },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const { squares: currentSquares } = history[currentMove];

  const handlePlay = useCallback(
    (nextSquares) => {
      const nextMove = currentMove + 1;
      const nextHistory = [
        ...history.slice(0, nextMove),
        { id: nextMove, squares: nextSquares },
      ];
      setHistory(nextHistory);
      setCurrentMove(nextMove);
    },
    [currentMove, history],
  );

  const handleJumpTo = useCallback((move) => {
    setCurrentMove(move);
  }, []);

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {history.map(({ id }) => (
            <MoveItem key={id} id={id} onJumpTo={handleJumpTo} />
          ))}
        </ol>
      </div>
    </div>
  );
}
