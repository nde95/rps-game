import { GameSpace } from "./components/gameboard";
import './App.css';
import { useState } from "react";

const App = () => {
  const [restartGame, setRestartGame] = useState(false);

  const handleRestartGame = () => {
    setRestartGame((prev) => !prev);
  };

  return (
    <>
      <button className="menuButton" onClick={handleRestartGame}>Restart Game</button>
      <GameSpace
        key={restartGame} // Add a key to GameSpace to force remount on restart
        numberOfID1={10} // Scissors
        numberOfID2={10} // Rock
        numberOfID3={10} // Paper
      />
    </>
  );
};

export default App;

