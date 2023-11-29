import { useState, useEffect } from 'react';
import { GameSpace } from './components/gameboard';
import './App.css';
import GameOver from './components/alert/gameOver';
import Swal from 'sweetalert2';
import MenuOptions from './components/menu/menuoptions';

const App = () => {
  const [restartGame, setRestartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winnerId, setWinnerId] = useState(null);
  const [muted, setMuted] = useState(true);
  const [numberOfID1, setNumberOfID1] = useState(10);
  const [numberOfID2, setNumberOfID2] = useState(10);
  const [numberOfID3, setNumberOfID3] = useState(10);

  const handleRestartGame = () => {
    setRestartGame((prev) => !prev);
    setGameOver(false);
  };

  const handleMutedChange = () => {
    setMuted((prev) => !prev);

    // Determine the icon based on the muted state
    const icon = muted ? 'success' : 'error';

    Swal.fire({
      icon: icon,
      title: 'Sounds ' + (muted ? 'On' : 'Off'),
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleGameOver = (winnerId) => {
    setWinnerId(winnerId);
    setGameOver(true);
  };

  // Use useEffect to update the GameSpace component when muted changes
  useEffect(() => {
    setRestartGame((prev) => !prev);
  }, [muted]);

  const handleSetObjectCounts = (count) => {
    setNumberOfID1(count);
    setNumberOfID2(count);
    setNumberOfID3(count);
    handleRestartGame()
  };


  return (
    <>
      <div className="menu">
        <MenuOptions onSetObjectCounts={handleSetObjectCounts} />
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
        numberOfID1={numberOfID1}
        numberOfID2={numberOfID2}
        numberOfID3={numberOfID3}
        onGameOver={handleGameOver}
        muted={muted} // Pass the muted state to GameSpace
      />
    </>
  );
};

export default App;