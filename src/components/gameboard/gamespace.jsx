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
            // Create ID 1 objects in the top left third
            objects.push({
                id: 1,
                left: Math.random() * (window.innerWidth / 3), // Left within the left third
                top: Math.random() * (window.innerHeight / 3), // Top within the top third
            });
        }

        for (let i = 1; i <= numberOfID2; i++) {
            // Create ID 2 objects in the top right third
            objects.push({
                id: 2,
                left: (window.innerWidth / 3) * 2 + Math.random() * (window.innerWidth / 3), // Left within the right third
                top: Math.random() * (window.innerHeight / 3), // Top within the top third
            });
        }

        for (let i = 1; i <= numberOfID3; i++) {
            // Create ID 3 objects in the bottom center third
            objects.push({
                id: 3,
                left: (window.innerWidth / 3) + Math.random() * (window.innerWidth / 3), // Left within the center third
                top: (window.innerHeight / 3) * 2 + Math.random() * (window.innerHeight / 3), // Top within the bottom third
            });
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
            const updatedGameObjects = prevGameObjects.map(obj => {
                let deltaX = 0;
                let deltaY = 0;

                // Check the ID of the current object and adjust movement accordingly
                switch (obj.id) {
                    case 1: // Scissors
                        const target3 = prevGameObjects.find(targetObj => targetObj.id === 3);
                        if (target3) {
                            deltaX = (target3.left - obj.left) / 10;
                            deltaY = (target3.top - obj.top) / 10;
                        }
                        break;
                    case 2: // Rock
                        const target1 = prevGameObjects.find(targetObj => targetObj.id === 1);
                        if (target1) {
                            deltaX = (target1.left - obj.left) / 10;
                            deltaY = (target1.top - obj.top) / 10;
                        }
                        break;
                    case 3: // Paper
                        const target2 = prevGameObjects.find(targetObj => targetObj.id === 2);
                        if (target2) {
                            deltaX = (target2.left - obj.left) / 10;
                            deltaY = (target2.top - obj.top) / 10;
                        }
                        break;
                    default:
                        break;
                }

                // Update the position based on calculated deltas
                return {
                    ...obj,
                    left: obj.left + deltaX,
                    top: obj.top + deltaY,
                };
            });

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