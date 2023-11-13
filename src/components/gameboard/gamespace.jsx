import React, { useState, useEffect } from 'react';
import GameObject from './gameobject';
import './game.css';

const GameSpace = () => {
    // Number of each to spawn
    const numberOfID1 = 3; // Scissors
    const numberOfID2 = 3; // Rock
    const numberOfID3 = 3; // Paper

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


    // Function to determine the relative strength between two IDs
    const getStrength = (id1, id2) => {
        const strength = id1 - id2;
        console.log(`Strength between ${id1} and ${id2}: ${strength}`);
        return strength;
    };


    // Movement of created objects
    const updateGameObjects = () => {
        setGameObjects((prevGameObjects) => {
            const updatedGameObjects = prevGameObjects.map((obj) => {
                let deltaX = 0;
                let deltaY = 0;

                // Declare variables outside the switch
                let targetScissors, targetRock, targetPaper;

                // Check the ID of the current object and adjust movement accordingly
                switch (obj.id) {
                    case 1: // Scissors
                        targetRock = prevGameObjects.find((targetObj) => targetObj.id === 2);
                        targetPaper = prevGameObjects.find((targetObj) => targetObj.id === 3);

                        if (targetRock && targetPaper) {
                            // Check the distances
                            const distanceToRock = Math.sqrt(
                                (obj.left - targetRock.left) ** 2 + (obj.top - targetRock.top) ** 2
                            );
                            const distanceToPaper = Math.sqrt(
                                (obj.left - targetPaper.left) ** 2 + (obj.top - targetPaper.top) ** 2
                            );

                            // Adjust movement based on distances
                            if (distanceToRock < distanceToPaper && distanceToRock < 30) {
                                // Avoid Rock
                                console.log('Scissors Avoiding Rock');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetRock.left) / 10;
                                deltaY = (obj.top - targetRock.top) / 10;
                            } else {
                                // Seek Paper
                                console.log('Scissors Seeking Paper');
                                deltaX = (targetPaper.left - obj.left) / 10;
                                deltaY = (targetPaper.top - obj.top) / 10;
                            }
                        }
                        break;
                    case 2: // Rock
                        targetScissors = prevGameObjects.find((targetObj) => targetObj.id === 1);
                        targetPaper = prevGameObjects.find((targetObj) => targetObj.id === 3);

                        if (targetScissors && targetPaper) {
                            // Check the distances
                            const distanceToScissors = Math.sqrt(
                                (obj.left - targetScissors.left) ** 2 + (obj.top - targetScissors.top) ** 2
                            );
                            const distanceToPaper = Math.sqrt(
                                (obj.left - targetPaper.left) ** 2 + (obj.top - targetPaper.top) ** 2
                            );

                            // Adjust movement based on distances
                            if (distanceToPaper < distanceToScissors && distanceToPaper < 30) {
                                // Avoid Paper
                                console.log('Rock Avoiding Paper');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetPaper.left) / 10;
                                deltaY = (obj.top - targetPaper.top) / 10;
                            } else {
                                // Seek Scissors
                                console.log('Rock Seeking Scissors');
                                deltaX = (targetScissors.left - obj.left) / 10;
                                deltaY = (targetScissors.top - obj.top) / 10;
                            }
                        }
                        break;
                    case 3: // Paper
                        targetScissors = prevGameObjects.find((targetObj) => targetObj.id === 1);
                        targetRock = prevGameObjects.find((targetObj) => targetObj.id === 2);

                        if (targetScissors && targetRock) {
                            // Check the distances
                            const distanceToScissors = Math.sqrt(
                                (obj.left - targetScissors.left) ** 2 + (obj.top - targetScissors.top) ** 2
                            );
                            const distanceToRock = Math.sqrt(
                                (obj.left - targetRock.left) ** 2 + (obj.top - targetRock.top) ** 2
                            );

                            // Adjust movement based on distances
                            if (distanceToScissors < distanceToRock && distanceToScissors < 30) {
                                // Avoid Scissors
                                console.log('Paper Avoiding Scissors');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetScissors.left) / 10;
                                deltaY = (obj.top - targetScissors.top) / 10;
                            } else {
                                // Seek Rock
                                console.log('Paper Seeking Rock');
                                deltaX = (targetRock.left - obj.left) / 10;
                                deltaY = (targetRock.top - obj.top) / 10;
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




    // Use an effect to continuously update the game object positions
    useEffect(() => {
        const interval = setInterval(updateGameObjects, 2000); // Adjust the time interval as needed
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