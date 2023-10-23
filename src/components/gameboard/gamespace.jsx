import React, { useState, useEffect } from 'react';
import GameObject from './gameobject';

const GameSpace = () => {
    // Define the initial state for game objects
    const [gameObjects, setGameObjects] = useState([
        { id: 1, left: 10, top: 10 },
        { id: 2, left: 50, top: 50 },
        { id: 3, left: 100, top: 100 },
    ]);

    // Your movement and interaction logic can go here, for example, using useEffect for animation

    return (
        <div id="game-space">
            {gameObjects.map((gameObject) => (
                <GameObject key={gameObject.id} {...gameObject} />
            ))}
        </div>
    );
};

export default GameSpace;