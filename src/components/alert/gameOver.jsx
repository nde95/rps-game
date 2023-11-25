import Swal from 'sweetalert2';
import React from 'react';
import scissorsWin from '../../assets/scissors.png';
import rockWin from '../../assets/rock.png'
import paperWin from '../../assets/paper.png'

const GameOver = ({ winnerId, handleRestartGame }) => {
    let winnerMessage = '';
    let winnerIcon = '';

    // Determine which ID won and customize the message
    switch (winnerId) {
        case 1:
            winnerMessage = 'Scissors win!';
            winnerIcon = scissorsWin;
            break;
        case 2:
            winnerMessage = 'Rock wins!';
            winnerIcon = rockWin;
            break;
        case 3:
            winnerMessage = 'Paper wins!';
            winnerIcon = paperWin;
            break;
        default:
            winnerMessage = 'Game Over!';
    }

    const iconHtml = `<img src="${winnerIcon}" class="swal2-icon" style="width: 80px; height: 80px;" alt="Winner Icon">`;

    // Game over alert
    Swal.fire({
        title: winnerMessage,
        iconHtml: iconHtml,
        confirmButtonText: 'Play Again',
        preConfirm: () => {
            handleRestartGame();
        }
    });

    return (
        <div className="alert"></div>
    );
};

export default GameOver;