import { useMemo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../context/MyContext";
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
  console.log("Key1: " + key1);
  console.log("Key2: " + key2);

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
      stroke={(selected && "lightblue") || "transparent"}
      strokeWidth={0.5}
      onClick={() => onPieceClick(square, index, color)}
    />
  );
}

export default function Game() {  
  const { seeButtonsFunction } = useContext(MyContext);
  const [pieces, setPieces] = useState([]);
  const [whiteRemaining, setWhiteRemaining] = useState(9);
  const [blackRemaining, setBlackRemaining] = useState(9);
  const [jumpMode, setJumpMode] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [color, setColor] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [removePieceMode, setRemovePieceMode] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [clickedSquare, setClickedSquare] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const whitePiecesCount = pieces.filter((s) => s.color === "white").length;
  const blackPiecesCount = pieces.filter((s) => s.color === "black").length;

  const ButtonClick = () => {
    seeButtonsFunction();
  };
  function toggleColor() {
    setColor((c) => (c === "white" ? "black" : "white"));
  }

  useEffect(() => {
    if (clicked && checkLine(clickedSquare, clickedIndex)) {
      console.log("Clicked: " + clicked);
      setRemovePieceMode(true); 
      setClicked(false); 
    } else if (clicked) {
      toggleColor();
    }
  }, [pieces, clicked]);

  function checkLine(square, index) {
    const nextIndex = (index + 1) % 8;
    if (index % 2 !== 0) {
      const prev = pieces.find(
        (s) => s.square === square && s.index === index - 1 //trazim isti kvadrat i index manji za 1
      );
      const next = pieces.find(
        (s) => s.square === square && s.index === nextIndex 
      );
      
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

  useEffect(() => {
    //KO JE POBEDIO!!
    if (whiteRemaining === 0 && blackRemaining === 0) {
      if (whitePiecesCount === 2 || blackPiecesCount === 2) {
        const winner = whitePiecesCount === 2 ? "black" : "white";
        alert(
          `Game Over! ${winner[0].toUpperCase() + winner.slice(1)} has won.`
        );
        setIsGameActive(false);
        
      }
    }
  }, [
    pieces,
    whiteRemaining,
    blackRemaining,
    whitePiecesCount,
    blackPiecesCount,
  ]);

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
      
      setPieces((s) => [...s, { square, index, color }]); 
      if (color === "white") {
        setWhiteRemaining(whiteRemaining - 1);
      } else if (color === "black") {
        setBlackRemaining(blackRemaining - 1);
      }
      clicked = true;
    } else {
      
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

  function isPiecePartOfLine(clickedPiece, pieces) {
    const { square, index, color } = clickedPiece;
    const horizontalLineIndices = [
      [0, 1, 2],
      [2, 3, 4],
      [4, 5, 6],
      [6, 7, 0],
    ];
    const isHorizontalLine = horizontalLineIndices.some(
      (indices) =>
        indices.includes(index) &&
        indices.every((i) =>
          pieces.some(
            (p) => p.square === square && p.index === i % 8 && p.color === color
          )
        )
    );
    if (isHorizontalLine) {
      return true;
    }
    if (index % 2 === 1) {
      const isVerticalLine =
        pieces.filter((p) => p.index === index && p.color === color).length ===
        3;
      if (isVerticalLine) {
        return true;
      }
    }
    return false;
  }
  function canRemovePiece(clickedPiece, pieces, currentColor) {
    const opponentPieces = pieces.filter(p => p.color !== currentColor);
    const inLineOpponentPieces = opponentPieces.filter(p => isPiecePartOfLine(p, pieces));
  
    if (inLineOpponentPieces.length === opponentPieces.length || !isPiecePartOfLine(clickedPiece, pieces)) {
      return true;
    }
  
    return false;
  }
  
  function onPieceClick(square, index, pieceColor) {
    if (!isGameActive) return;
  
    // Logika za uklanjanje protivničke figure u removePieceMode
    if (removePieceMode) {
      // Dozvoljava uklanjanje samo ako je boja protivnika
      if (color !== pieceColor) {
        const clickedPiece = { square, index, color: pieceColor };
        if (canRemovePiece(clickedPiece, pieces,color)) {
          setPieces(pieces.filter((p) => p.square !== square || p.index !== index));
          setRemovePieceMode(false);
          toggleColor();
          return;
        }
      }
      // Ako je figura iste boje kao igrač, ne dozvoljava uklanjanje
      return;
    }
  
    // Blokira selekciju ako nije na redu
    if (color !== pieceColor) return;
  
    // Ako igrač još uvek ima figure koje može postaviti, blokira pomeranje
    if (
      (pieceColor === "white" && whiteRemaining > 0) ||
      (pieceColor === "black" && blackRemaining > 0)
    ) {
      return;
    }
  
    // Logika za selekciju i pomeranje figura
    if (selectedPiece &&
      selectedPiece.square === square &&
      selectedPiece.index === index &&
      selectedPiece.color === pieceColor) {
      // Deselektuje figuru ako je već selektovana
      setSelectedPiece(null);
    } else {
      // Selektuje figuru za pomeranje
      const newPiece = pieces.find(
        (s) => s.square === square && s.index === index && s.color === pieceColor
      );
      setSelectedPiece(newPiece);
      
      // Proverava da li igrač ima samo tri figure i postavlja jump mode ako je to slučaj
      const playerHasThreePieces = pieces.filter(p => p.color === pieceColor).length === 3;
      setJumpMode(playerHasThreePieces);
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
          {pieces.map(({ square, index, color }) => (
            <Piece
              key={`${square}-${index}-${color}`}
              square={square}
              index={index}
              color={color}
              selected={
                selectedPiece &&
                selectedPiece.square === square &&
                selectedPiece.index === index &&
                selectedPiece.color === color
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
