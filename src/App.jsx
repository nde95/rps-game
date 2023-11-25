import { useState } from 'react';
import { GameSpace } from './components/gameboard';
import './App.css';
import GameOver from './components/alert/gameOver';

const App = () => {
  const [restartGame, setRestartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winnerId, setWinnerId] = useState(null);

  const handleRestartGame = () => {
    setRestartGame((prev) => !prev);
    setGameOver(false);
  };

  const handleGameOver = (winnerId) => {
    setWinnerId(winnerId);
    setGameOver(true);
  };

  return (
    <>
      <button className="menuButton" onClick={handleRestartGame}>
        Restart Game
      </button>
      {gameOver ? <GameOver winnerId={winnerId} handleRestartGame={handleRestartGame} /> : null}
      <GameSpace
        key={restartGame} // Add a key to GameSpace to force remount on restart
        numberOfID1={10} // Scissors
        numberOfID2={10} // Rock
        numberOfID3={10} // Paper
        onGameOver={handleGameOver}
      />
    </>
  );
};

export default App;