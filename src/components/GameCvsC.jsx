import { useMemo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../context/MyContext";
import axios from "axios";
import "./Game.css";

const connections = {
  "0-0": ["0-1", "0-7"],
  "0-1": ["0-0", "0-2", "1-1"],
  "0-2": ["0-1", "0-3"],
  "0-3": ["0-2", "0-4", "1-3"],
  "0-4": ["0-3", "0-5"],
  "0-5": ["0-4", "0-6", "1-5"],
  "0-6": ["0-5", "0-7"],
  "0-7": ["0-6", "0-0", "1-7"],

  "1-0": ["1-1", "1-7"],
  "1-1": ["1-2", "1-0", "0-1", "2-1"],
  "1-2": ["1-3", "1-1"],
  "1-3": ["1-4", "1-2", "0-3", "2-3"],
  "1-4": ["1-5", "1-3"],
  "1-5": ["1-6", "1-4", "0-5", "2-5"],
  "1-6": ["1-7", "1-5"],
  "1-7": ["1-0", "1-6", "0-7", "2-7"],

  "2-0": ["2-1", "2-7"],
  "2-1": ["2-2", "2-0", "1-1"],
  "2-2": ["2-3", "2-1"],
  "2-3": ["2-4", "2-2", "1-3"],
  "2-4": ["2-5", "2-3"],
  "2-5": ["2-6", "2-4", "1-5"],
  "2-6": ["2-7", "2-5"],
  "2-7": ["2-0", "2-6", "1-7"],
};

function areConnected(square1, index1, square2, index2) {
  const key1 = `${square1}-${index1}`;
  const key2 = `${square2}-${index2}`;

  return connections[key1]?.includes(key2);
}

function Board({ padding, onCircleClick }) {
  
  const startPadding = padding;
  const endPadding = 100 - startPadding;
  const square = padding / 10 - 1;
  return (
    <>
      <line
        className="board-line"
        x1={startPadding}
        y1={startPadding}
        x2={endPadding}
        y2={startPadding}
      />
      <line
        className="board-line"
        x1={endPadding}
        y1={startPadding}
        x2={endPadding}
        y2={endPadding}
      />
      <line
        className="board-line"
        x1={endPadding}
        y1={endPadding}
        x2={startPadding}
        y2={endPadding}
      />
      <line
        className="board-line"
        x1={startPadding}
        y1={endPadding}
        x2={startPadding}
        y2={startPadding}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 0)}
        cx={startPadding}
        cy={startPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 1)}
        cx={50}
        cy={startPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 2)}
        cx={endPadding}
        cy={startPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 3)}
        cx={endPadding}
        cy={50}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 4)}
        cx={endPadding}
        cy={endPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 5)}
        cx={50}
        cy={endPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 6)}
        cx={startPadding}
        cy={endPadding}
        r={1}
      />
      <circle
        className="board-circle"
        onClick={() => onCircleClick(square, 7)}
        cx={startPadding}
        cy={50}
        r={1}
      />
    </>
  );
}

function Piece({ square, index, color, selected, onPieceClick }) {
  let x = 0;
  let y = 0;
  if (index >= 0 && index < 3) {
    y = square * 10 + 10;
    if (index === 0) {
      x = square * 10 + 10;
    } else if (index === 1) {
      x = 50;
    } else if (index === 2) {
      x = 100 - (square * 10 + 10);
    }
  } else if (index >= 4 && index < 7) {
    y = 100 - (square * 10 + 10);
    if (index === 4) {
      x = 100 - (square * 10 + 10);
    } else if (index === 5) {
      x = 50;
    } else if (index === 6) {
      x = square * 10 + 10;
    }
  } else if (index === 3) {
    y = 50;
    x = 100 - (square * 10 + 10);
  } else if (index === 7) {
    y = 50;
    x = square * 10 + 10;
  }
  return (
    <circle
      cx={x}
      cy={y}
      r={3}
      fill={color}
      stroke={(selected && "green") || "transparent"}
      strokeWidth={0.5}
      onClick={() => onPieceClick(square, index, color)}
    />
  );
}

export default function Game() {
  const { seeButtonsFunction, difficulty } = useContext(MyContext);

  const ButtonClick = () => {
    seeButtonsFunction();
  };

  const [pieces, setPieces] = useState([]);
  const [whiteRemaining, setWhiteRemaining] = useState(9);
  const [blackRemaining, setBlackRemaining] = useState(9);
  const whitePiecesCount = pieces.filter((s) => s.color === "white").length;
  const blackPiecesCount = pieces.filter((s) => s.color === "black").length;
  const [jumpMode, setJumpMode] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [color, setColor] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [removePieceMode, setRemovePieceMode] = useState(false);

  function toggleColor() {
    setColor((c) => (c === "white" ? "black" : "white"));
  }

  function checkLine(square, index) {
    if (index % 2 !== 0) {
      // centranli
      const prev = pieces.find(
        (s) => s.square === square && s.index === index - 1
      );
      const next = pieces.find(
        (s) => s.square === square && s.index === index + 1
      );
      console.log("prev", prev);
      console.log("next", next);
      if (prev && next && prev.color === color && next.color === color) {
        return true;
      }

      let newLine = true;
      for (let i = 0; i < 3; i++) {
        const st = pieces.find((s) => s.square === i && s.index === index);
        if (!st || st.color !== color) {
          newLine = false;
          break;
        }
      }
      if (newLine) {
        return true;
      }
    } else {
      const prevIndex = index - 1 >= 0 ? index - 1 : 7;
      const prevPrevIndex = index - 2 >= 0 ? index - 2 : 6;
      const nextIndex = index + 1;
      const nextNextIndex = (index + 2) % 8;

      const prev = pieces.find(
        (s) => s.square === square && s.index === prevIndex
      );
      const prevPrev = pieces.find(
        (s) => s.square === square && s.index === prevPrevIndex
      );

      // TODO: check what happens if two lines are created

      if (
        prev &&
        prevPrev &&
        prev.color === color &&
        prevPrev.color === color
      ) {
        return true;
      }

      const next = pieces.find(
        (s) => s.square === square && s.index === nextIndex
      );
      const nextNext = pieces.find(
        (s) => s.square === square && s.index === nextNextIndex
      );

      if (
        next &&
        nextNext &&
        next.color === color &&
        nextNext.color === color
      ) {
        return true;
      }
    }

    return false;
  }

  const [clicked, setClicked] = useState(false);
  const [clickedSquare, setClickedSquare] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);

  useEffect(() => {
    if (whiteRemaining === 0 && blackRemaining === 0) {
      if (whitePiecesCount === 2 || blackPiecesCount === 2) {
        const winner = whitePiecesCount === 2 ? "black" : "white";
        alert(
          `Game Over! ${winner[0].toUpperCase() + winner.slice(1)} has won.`
        );
        setIsGameActive(false);
        // Ovde dodajte logiku za onemogućavanje daljih poteza u igri
      }
    }
  }, [
    pieces,
    whiteRemaining,
    blackRemaining,
    whitePiecesCount,
    blackPiecesCount,
  ]);

  useEffect(() => {
    if (clicked && checkLine(clickedSquare, clickedIndex)) {
      setRemovePieceMode(true);
      setClicked(false);
    } else if (clicked) {
      toggleColor();
    }
  }, [pieces, clicked]);

  function onCircleClick(square, index) {
    if (!isGameActive) return;
    console.log("circle clicked", square, index);
    if (removePieceMode) return;

    setClickedSquare(square);
    setClickedIndex(index);

    let clicked = false;
    if (
      (color === "white" && whiteRemaining > 0) ||
      (color === "black" && blackRemaining > 0)
    ) {
      // putting new pieces
      setPieces((s) => [...s, { square, index, color }]);
      if (color === "white") {
        setWhiteRemaining(whiteRemaining - 1);
      } else if (color === "black") {
        setBlackRemaining(blackRemaining - 1);
      }
      clicked = true;
    } else {
      // moving pieces
      if (
        selectedPiece &&
        (jumpMode ||
          areConnected(
            selectedPiece.square,
            selectedPiece.index,
            square,
            index
          ))
      ) {
        setJumpMode(false);
        setPieces(
          pieces.map((piece) =>
            piece.square === selectedPiece.square &&
            piece.index === selectedPiece.index &&
            piece.color === selectedPiece.color
              ? { square, index, color: selectedPiece.color }
              : piece
          )
        );
        clicked = true;
      }
    }

    setClicked(clicked);
  }

  function isPieceConnected(piece) {
    // Provera za svaku liniju koju kamenčić može formirati
    const possibleLines = [
      // Horizontalne linije
      pieces.filter(
        (s) => s.square === piece.square && Math.abs(s.index - piece.index) <= 2
      ),
      // Vertikalne linije
      pieces.filter(
        (s) => s.index === piece.index && Math.abs(s.square - piece.square) <= 2
      ),
    ];

    // Provera da li neka od linija sadrži tri kamenčića iste boje
    return possibleLines.some(
      (line) => line.length === 3 && line.every((s) => s.color === piece.color)
    );
  }

  function onPieceClick(square, index, pieceColor) {
    if (!isGameActive) return;
    console.log("piece clicked", square, index, pieceColor);
    const clickedPiece = { square, index, color: pieceColor };
    if (removePieceMode) {
      if (color === pieceColor) return;
      const pieceIsConnected = isPieceConnected(clickedPiece);
      const disconnectedPieces = pieces.filter(
        (s) => s.color !== color && !isPieceConnected(s)
      );

      if (pieceIsConnected && disconnectedPieces.length > 0) {
        return;
      }

      setPieces(
        pieces.filter((s) => !(s.square === square && s.index === index))
      );
      //setStones(stones.filter((s) => s !== clickedStone));

      setRemovePieceMode(false);

      // 4 because of setStones taking effect only after next render
      if (
        whiteRemaining === 0 &&
        blackRemaining === 0 &&
        ((color === "white" && blackPiecesCount === 4) ||
          (color === "black" && whitePiecesCount === 4))
      ) {
        setJumpMode(true);
      }

      if (
        (color === "white" && blackPiecesCount === 3) ||
        (color === "black" && whitePiecesCount === 3)
      ) {
        // Game Over!
      }

      toggleColor();
      return;
    }

    if (color !== pieceColor) return;
    if (
      (pieceColor === "white" && whiteRemaining > 0) ||
      (pieceColor === "black" && blackRemaining > 0)
    )
      return;
    if (
      selectedPiece &&
      selectedPiece.square === square &&
      selectedPiece.index === index &&
      selectedPiece.color === pieceColor
    ) {
      setSelectedPiece(null);
    } else {
      const newPiece = pieces.find(
        (s) =>
          s.square === square && s.index === index && s.color === pieceColor
      );
      setSelectedPiece(newPiece);
    }
  }

  function generateConnectedLines() {
    const lines = [];

    for (let square = 0; square < 3; square++) {
      indexLoop: for (let startIndex = 0; startIndex < 4; startIndex++) {
        const start = startIndex * 2;
        const end = start + 2;
        const colors = [];
        for (let index = start; index <= end; index++) {
          const piece = pieces.find(
            (s) => s.square === square && s.index === index % 8
          );
          if (!piece) continue indexLoop;
          colors.push(piece.color);
        }
        if (colors.length !== 3) continue; // mozda ne treba
        let lineColor;
        if (colors.every((c) => c === "white")) {
          lineColor = "red";
        } else if (colors.every((c) => c === "black")) {
          lineColor = "green";
        } else {
          continue;
        }

        if (startIndex === 0 || startIndex === 2) {
          lines.push(
            <line
              key={`${square}-${startIndex}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              data-start-index={startIndex}
              x1={square * 10 + 10}
              y1={startIndex === 2 ? 90 - square * 10 : 10 + square * 10}
              x2={90 - square * 10}
              y2={startIndex === 2 ? 90 - square * 10 : 10 + square * 10}
            />
          );
        } else {
          lines.push(
            <line
              key={`${square}-${startIndex}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              data-start-index={startIndex}
              x1={startIndex === 1 ? 90 - square * 10 : 10 + square * 10}
              y1={square * 10 + 10}
              x2={startIndex === 1 ? 90 - square * 10 : 10 + square * 10}
              y2={90 - square * 10}
            />
          );
        }
      }
    }

    outerLoop: for (let index = 1; index < 8; index += 2) {
      const colors = [];
      for (let square = 0; square < 3; square++) {
        const piece = pieces.find(
          (s) => s.square === square && s.index === index
        );
        if (!piece) continue outerLoop;
        colors.push(piece.color);
      }

      if (colors.length !== 3) continue;
      let lineColor;
      if (colors.every((c) => c === "white")) {
        lineColor = "red";
      } else if (colors.every((c) => c === "black")) {
        lineColor = "green";
      } else {
        continue;
      }

      switch (index) {
        case 1:
          lines.push(
            <line
              key={`crossed-${index}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              x1={50}
              y1={10}
              x2={50}
              y2={30}
            />
          );
          break;
        case 3:
          lines.push(
            <line
              key={`crossed-${index}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              x1={70}
              y1={50}
              x2={90}
              y2={50}
            />
          );
          break;
        case 5:
          lines.push(
            <line
              key={`crossed-${index}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              x1={50}
              y1={70}
              x2={50}
              y2={90}
            />
          );
          break;
        case 7:
          lines.push(
            <line
              key={`crossed-${index}`}
              style={{ stroke: lineColor, strokeWidth: 0.7 }}
              x1={10}
              y1={50}
              x2={30}
              y2={50}
            />
          );
          break;
      }
    }

    return lines;
  }

  const connectedLines = useMemo(generateConnectedLines, [pieces]);

  const [moveToPiece, setMoveToPiece] = useState(null);

  function playMove(move) {
    switch (move[0]) {
      case "set": {
        const { color, square, index } = fromBackend(move);
        onCircleClick(square, index);
        break;
      }
      case "move": {
        const [to, from] = fromBackend(move);
        console.log("from", from);
        console.log("to", to);
        onPieceClick(from.square, from.index, from.color);
        setMoveToPiece(to);
        break;
      }
      case "remove": {
        const { color, square, index } = fromBackend(move);
        onPieceClick(square, index, color === "white" ? "black" : "white");
        break;
      }
    }
  }

  useEffect(() => {
    console.log("move to piece", moveToPiece);
    if (moveToPiece) {
      onCircleClick(moveToPiece.square, moveToPiece.index);
    }
    setMoveToPiece(null);
  }, [moveToPiece]);

  function indexToBackendIndex(index) {
    if (index < 3) {
      return [0, index];
    }

    switch (index) {
      case 3:
        return [1, 2];
      case 4:
        return [2, 2];
      case 5:
        return [2, 1];
      case 6:
        return [2, 0];
      case 7:
        return [1, 0];
    }
  }

  function toBackendRepr() {
    const matrix = Array(3)
      .fill(null)
      .map((_) =>
        Array(3)
          .fill(null)
          .map((_) => Array(3).fill(0))
      );

    let white_count = 0;
    let black_count = 0;
    for (const piece of pieces) {
      const { color, square, index } = piece;
      const player = color === "white" ? 1 : -1;
      const x = square;
      const [y, z] = indexToBackendIndex(index);

      matrix[x][y][z] = player;

      if (player === 1) {
        white_count++;
      } else if (player === -1) {
        black_count++;
      }
    }

    const gameData = {
      pieces: matrix,
      difficulty: difficulty,
      line_made: removePieceMode,
      white_remaining: whiteRemaining,
      black_remaining: blackRemaining,
      white_count,
      black_count,
      player: color === "white" ? 1 : -1,
      turn: 0,
    };

    return gameData;
  }

  function fromBackend(move) {
    const [type, player, x, y, z, fromX, fromY, fromZ] = move;

    if (type === "set" || type === "remove") {
      return fromBackendCoordinates(move);
    } else if (type === "move") {
      const to = fromBackendCoordinates([type, player, x, y, z]);
      const from = fromBackendCoordinates([type, player, fromX, fromY, fromZ]);
      return [to, from];
    }
  }
  function fromBackendCoordinates(move) {
    const [type, player, x, y, z] = move;
    const square = x;
    let index;
    if (y === 0) {
      index = z;
    } else if (y === 1 && z === 0) {
      index = 7;
    } else if (y === 1 && z === 2) {
      index = 3;
    } else if (y === 2 && z === 0) {
      index = 6;
    } else if (y === 2 && z === 1) {
      index = 5;
    } else if (y === 2 && z === 2) {
      index = 4;
    }

    return { color: player === 1 ? "white" : "black", square, index };
  }

  useEffect(() => {
    async function getAiMove() {
      console.log("sending request");
      const gameData = toBackendRepr();
      try {
        const response = await axios.post(
          "http://localhost:8000/game/9_man_moris/",
          gameData
        );
        const newMove = response.data;
        console.log(newMove.move);
        playMove(newMove.move);
      } catch (e) {
        console.error(e);
      }
    }
    const intervalId = setInterval(() => {
      getAiMove();
    }, 1500);

    return () => clearInterval(intervalId);
  }, [color, removePieceMode]);

  return (
    <>
      <div id="game-container">
        <div className="whiteCircle">
          <div className="white"></div>
        </div>
        <svg viewBox="0 0 100 100">
          <line className="board-line" x1={50} y1={10} x2={50} y2={30} />
          <line className="board-line" x1={70} y1={50} x2={90} y2={50} />
          <line className="board-line" x1={50} y1={70} x2={50} y2={90} />
          <line className="board-line" x1={10} y1={50} x2={30} y2={50} />
          <Board padding={10} onCircleClick={onCircleClick} />
          <Board padding={20} onCircleClick={onCircleClick} />
          <Board padding={30} onCircleClick={onCircleClick} />
          {...connectedLines}
          {pieces.map((piece, idx) => (
    <Piece
      key={`piece-${idx}`} // idx is the array index, ensuring a unique key
      square={piece.square}
      index={piece.index}
      color={piece.color}
      selected={
        selectedPiece &&
        selectedPiece.square === piece.square &&
        selectedPiece.index === piece.index &&
        selectedPiece.color === piece.color
      }
      onPieceClick={onPieceClick}
    />
  ))}
</svg>
        
        <div>
          <div className="black"></div>
        </div>
        <div className="piece-counters">
          <div className="counter">
            <div className="piece white"></div>
            <span className="piece-number white">{whiteRemaining}</span>
            <span className="piece-count white">{whitePiecesCount}</span> 
          </div>

          {/* Counter for black pieces */}
          <div className="counter">
            <div className="piece black"></div>
            <span className="piece-number black">{blackRemaining}</span>
            <span className="piece-count black">{blackPiecesCount}</span> 
          </div>
        </div>
        <Link to="/">
          <button className="homeScreen" onClick={ButtonClick}>
            Home screen
          </button>
        </Link>
      </div>
      <div className="turn">
        <h3>TURN: {color}</h3>
      </div>
    </>
  );
}
