import SweetAlert2 from "react-sweetalert2";
import Swal from 'sweetalert2';
import { GameSpace } from "./components/gameboard";
import './App.css';
import { useState } from "react";

const App = () => {
  const [restartGame, setRestartGame] = useState(false);

  const handleRestartGame = () => {
    setRestartGame((prev) => !prev);
  };

  const handleGameOver = (winnerId) => {
    let winnerMessage = '';

    // Determine which ID won and customize the message
    switch (winnerId) {
      case 1:
        winnerMessage = 'Scissors won!';
        break;
      case 2:
        winnerMessage = 'Rock won!';
        break;
      case 3:
        winnerMessage = 'Paper won!';
        break;
      default:
        winnerMessage = 'Game Over!';
    }

    // Game over alert
    Swal.fire({
      title: winnerMessage,
      text: 'Do you want to continue',
      icon: 'success',
      confirmButtonText: 'Cool'
    });
  };

  return (
    <>
      <button className="menuButton" onClick={handleRestartGame}>Restart Game</button>
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

