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
                            // Check the relative strength
                            const strength = getStrength(obj.id, target3.id);
                            if (strength > 0) {
                                // Seek
                                deltaX = (target3.left - obj.left) / 10;
                                deltaY = (target3.top - obj.top) / 10;
                            } else {
                                // Avoid
                                deltaX = (obj.left - target3.left) / 10;
                                deltaY = (obj.top - target3.top) / 10;
                            }
                        }
                        break;
                    case 2: // Rock
                        const target1 = prevGameObjects.find(targetObj => targetObj.id === 1);
                        if (target1) {
                            // Check the relative strength
                            const strength = getStrength(obj.id, target1.id);
                            if (strength > 0) {
                                // Seek
                                deltaX = (target1.left - obj.left) / 10;
                                deltaY = (target1.top - obj.top) / 10;
                            } else {
                                // Avoid
                                deltaX = (obj.left - target1.left) / 10;
                                deltaY = (obj.top - target1.top) / 10;
                            }
                        }
                        break;
                    case 3: // Paper
                        const target2 = prevGameObjects.find(targetObj => targetObj.id === 2);
                        if (target2) {
                            // Check the relative strength
                            const strength = getStrength(obj.id, target2.id);
                            if (strength > 0) {
                                // Seek
                                deltaX = (target2.left - obj.left) / 10;
                                deltaY = (target2.top - obj.top) / 10;
                            } else {
                                // Avoid
                                deltaX = (obj.left - target2.left) / 10;
                                deltaY = (obj.top - target2.top) / 10;
                            }
                        }
                        break;
                    default:
                        break;
                }

                // Update the position based on calculated deltas
                const newLeft = obj.left + deltaX;
                const newTop = obj.top + deltaY;

                // Perform boundary checks to ensure objects stay within the game area
                const boundaryX = window.innerWidth - 30; // Adjust as needed
                const boundaryY = window.innerHeight - 30; // Adjust as needed

                return {
                    ...obj,
                    left: Math.max(0, Math.min(newLeft, boundaryX)),
                    top: Math.max(0, Math.min(newTop, boundaryY)),
                };
            });

            return updatedGameObjects;
        });
    };

    // Function to determine the relative strength between two IDs
    const getStrength = (id1, id2) => {
        // Define your strength rules here
        // For simplicity, let's assume higher ID is stronger, but you can define your own logic
        return id1 - id2;
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