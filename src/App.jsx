import { useContext } from "react";
import "./App.css";
import Game from "./components/Game";
import GamePvsC from "./components/GamePvsC";
import GameCvsC from "./components/GameCvsC";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import { MyContext } from "./context/MyContext";

function App() {
  const { seeButtons, seeButtonsFunction, difficulty, gameDifficultyFunction } = useContext(MyContext);
  const ButtonClick = (b) => {
    console.log(difficulty);
    seeButtonsFunction();
  };
  const difficultyChosing = (a) => {
    gameDifficultyFunction(a.target.value);
  };
  return (
    <BrowserRouter>
      <div className="backgroundImage"></div>
      <Routes>
        <Route path="/game" element={<Game />} />
        <Route path="/gamePvsC" element={<GamePvsC />} />
        <Route path="/gameCvsC" element={<GameCvsC />} />
      </Routes>

      {seeButtons && (
        <div className="buttonsContainer">
          <div>
            <h1>PyMlin - 9 Man Morris</h1>
          </div>
          <div className="buttonsGroup">
            <Link to="/game">
              <button className="dugmici" onClick={ButtonClick}>
                Player vs Player
              </button>
            </Link>
            <Link to="/gamePvsC">
              <button className="dugmici" onClick={ButtonClick}>
                Player vs Computer
              </button>
            </Link>
            <Link to="/gameCvsC">
              <button className="dugmici" onClick={ButtonClick}>
                Computer vs Computer
              </button>
            </Link>
            <h2>Choose mode</h2>
            <select onChange={difficultyChosing}>
              <option value={"easy"}>Easy</option>
              <option value={"medium"}>Medium</option>
              <option value={"hard"}>Hard</option>
            </select>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
