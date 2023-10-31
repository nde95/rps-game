import React, { useState, useEffect } from 'react';
import GameObject from './gameobject';
import './game.css';

const GameSpace = () => {
    // Number of each to spawn
    const numberOfID1 = 3;
    const numberOfID2 = 2;
    const numberOfID3 = 4;

    const generateGameObjects = () => {
        const objects = [];
        for (let i = 1; i <= numberOfID1; i++) {
            objects.push({ id: 1, left: Math.random() * 500, top: Math.random() * 500 });
        }
        for (let i = 1; i <= numberOfID2; i++) {
            objects.push({ id: 2, left: Math.random() * 500, top: Math.random() * 500 });
        }
        for (let i = 1; i <= numberOfID3; i++) {
            objects.push({ id: 3, left: Math.random() * 500, top: Math.random() * 500 });
        }
        return objects.map((obj, index) => ({
            ...obj,
            renderKey: obj.id + '-' + index, // Use a separate key for rendering
        }));
    };

    const [gameObjects, setGameObjects] = useState(generateGameObjects);

    // Movement of created objects 
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
                <GameObject key={gameObject.renderKey} {...gameObject} />
            ))}
        </div>
    );
};

export default GameSpace;