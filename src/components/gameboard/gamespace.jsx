import React, { useState, useEffect } from 'react';
import GameObject from './gameobject';
import './game.css';

const GameSpace = () => {
    const [gameObjects, setGameObjects] = useState([
        { id: 1, left: Math.random() * 500, top: Math.random() * 500 },
        { id: 2, left: Math.random() * 500, top: Math.random() * 500 },
        { id: 3, left: Math.random() * 500, top: Math.random() * 500 },
    ]);

    const updateGameObjects = () => {
        setGameObjects(prevGameObjects => {
            // Calculate the new positions based on the previous positions
            const updatedGameObjects = prevGameObjects.map(obj => ({
                ...obj,
                left: obj.left + Math.random() * 10,
                top: obj.top + Math.random() * 10,
            }));
            return updatedGameObjects;
        });
    };
    // Use an effect to continuously update the game object positions
    useEffect(() => {
        const interval = setInterval(updateGameObjects, 1000); // Adjust the time interval as needed
        return () => clearInterval(interval); // Clean up the interval on unmount
    }, []);

    return (
        <div id="game-space">
            {gameObjects.map((gameObject) => (
                <GameObject key={gameObject.id} {...gameObject} />
            ))}
        </div>
    );
};

export default GameSpace;