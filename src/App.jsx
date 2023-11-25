import { useState, useEffect } from 'react';
import { GameSpace } from './components/gameboard';
import './App.css';
import GameOver from './components/alert/gameOver';

const App = () => {
  const [restartGame, setRestartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winnerId, setWinnerId] = useState(null);
  const [muted, setMuted] = useState(true);

  const handleRestartGame = () => {
    setRestartGame((prev) => !prev);
    setGameOver(false);
  };

  const handleMutedChange = () => {
    setMuted((prev) => !prev);
  };

  const handleGameOver = (winnerId) => {
    setWinnerId(winnerId);
    setGameOver(true);
  };

  // Use useEffect to update the GameSpace component when muted changes
  useEffect(() => {
    setRestartGame((prev) => !prev);
  }, [muted]);

  return (
    <>
      <div className="menu">
        <button className="menuButton" onClick={handleRestartGame}>
          Restart Game
        </button>
        <input
          type="checkbox"
          className='menuButton'
          value='muted'
          id='muted'
          defaultChecked={muted}
          onChange={handleMutedChange}
        />
        <label htmlFor='muted'>Muted</label>
      </div>
      {gameOver ? <GameOver winnerId={winnerId} handleRestartGame={handleRestartGame} /> : null}
      <GameSpace
        key={restartGame}
        numberOfID1={10}
        numberOfID2={10}
        numberOfID3={10}
        onGameOver={handleGameOver}
        muted={muted} // Pass the muted state to GameSpace
      />
    </>
  );
};

export default App;