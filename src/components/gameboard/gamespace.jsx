import React, { useState, useEffect } from 'react';
import GameObject from './gameobject';
import './game.css';

const GameSpace = () => {
    // Number of each to spawn
    const numberOfID1 = 3; // Scissors
    const numberOfID2 = 3; // Rock
    const numberOfID3 = 0; // Paper

    const generateGameObjects = () => {
        const objects = [];

        for (let i = 1; i <= numberOfID1; i++) {
            // Create ID 1 (Scissors) objects in the top left third
            objects.push({
                id: 1,
                left: Math.random() * (window.innerWidth / 3), // Left within the left third
                top: Math.random() * (window.innerHeight / 3), // Top within the top third
            });
        }

        for (let i = 1; i <= numberOfID2; i++) {
            // Create ID 2 (Rocks) objects in the top right third
            objects.push({
                id: 2,
                left: (window.innerWidth / 3) * 2 + Math.random() * (window.innerWidth / 3), // Left within the right third
                top: Math.random() * (window.innerHeight / 3), // Top within the top third
            });
        }

        for (let i = 1; i <= numberOfID3; i++) {
            // Create ID 3 (Papers) objects in the bottom center third
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
    // const getStrength = (id1, id2) => {
    //     const strength = id1 - id2;
    //     console.log(`Strength between ${id1} and ${id2}: ${strength}`);
    //     return strength;
    // };


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

                        // Adjust movement based on distances if targetRock is present
                        if (targetRock) {
                            const distanceToRock = calculateDistance(obj, targetRock);
                            const distanceToPaper = targetPaper ? calculateDistance(obj, targetPaper) : Number.POSITIVE_INFINITY;

                            // Check for catching
                            if (distanceToRock < 100 && distanceToRock < distanceToPaper) {
                                console.log('Scissors caught by Rock');
                                return { ...obj, id: 2, state: 'caught' }; // Update ID and state
                            }

                            // Avoid Rock or Seek Paper based on distances
                            if (distanceToRock < distanceToPaper && distanceToRock < 30) {
                                console.log('Scissors Avoiding Rock');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetRock.left) / 10;
                                deltaY = (obj.top - targetRock.top) / 10;
                            } else {
                                console.log('Scissors Seeking Paper');
                                deltaX = targetPaper ? (targetPaper.left - obj.left) / 10 : 0;
                                deltaY = targetPaper ? (targetPaper.top - obj.top) / 10 : 0;
                            }
                        } else {
                            // Seek Paper if targetRock is not present
                            console.log('Scissors Seeking Paper');
                            deltaX = targetPaper ? (targetPaper.left - obj.left) / 10 : 0;
                            deltaY = targetPaper ? (targetPaper.top - obj.top) / 10 : 0;
                        }
                        break;

                    case 2: // Rock
                        targetScissors = prevGameObjects.find((targetObj) => targetObj.id === 1);
                        targetPaper = prevGameObjects.find((targetObj) => targetObj.id === 3);

                        // Adjust movement based on distances if targetScissors is present
                        if (targetScissors) {
                            const distanceToScissors = calculateDistance(obj, targetScissors);
                            const distanceToPaper = targetPaper ? calculateDistance(obj, targetPaper) : Number.POSITIVE_INFINITY;

                            // Check for catching
                            if (distanceToPaper < 100) {
                                console.log('Rock caught by Paper');
                                return { ...obj, id: 3, state: 'caught' }; // Update ID and state
                            }

                            // Avoid Paper or Seek Scissors based on distances
                            if (distanceToPaper < distanceToScissors && distanceToPaper < 30) {
                                console.log('Rock Avoiding Paper');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetPaper.left) / 10;
                                deltaY = (obj.top - targetPaper.top) / 10;
                            } else {
                                console.log('Rock Seeking Scissors');
                                deltaX = targetScissors ? (targetScissors.left - obj.left) / 10 : 0;
                                deltaY = targetScissors ? (targetScissors.top - obj.top) / 10 : 0;
                            }
                        } else {
                            // Seek Scissors if targetScissors is not present
                            console.log('Rock Seeking Scissors');
                            deltaX = targetScissors ? (targetScissors.left - obj.left) / 10 : 0;
                            deltaY = targetScissors ? (targetScissors.top - obj.top) / 10 : 0;
                        }
                        break;

                    case 3: // Paper
                        targetScissors = prevGameObjects.find((targetObj) => targetObj.id === 1);
                        targetRock = prevGameObjects.find((targetObj) => targetObj.id === 2);

                        // Adjust movement based on distances if targetScissors is present
                        if (targetScissors) {
                            const distanceToScissors = calculateDistance(obj, targetScissors);
                            const distanceToRock = targetRock ? calculateDistance(obj, targetRock) : Number.POSITIVE_INFINITY;

                            // Check for catching
                            if (distanceToScissors < 100 && distanceToScissors < distanceToRock) {
                                console.log('Paper caught by Scissors');
                                return { ...obj, id: 1, state: 'caught' }; // Update ID and state
                            }

                            // Avoid Scissors or Seek Rock based on distances
                            if (distanceToScissors < distanceToRock && distanceToScissors < 30) {
                                console.log('Paper Avoiding Scissors');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetScissors.left) / 10;
                                deltaY = (obj.top - targetScissors.top) / 10;
                            } else {
                                console.log('Paper Seeking Rock');
                                deltaX = targetRock ? (targetRock.left - obj.left) / 10 : 0;
                                deltaY = targetRock ? (targetRock.top - obj.top) / 10 : 0;
                            }
                        } else {
                            // Seek Rock if targetScissors is not present
                            console.log('Paper Seeking Rock');
                            deltaX = targetRock ? (targetRock.left - obj.left) / 10 : 0;
                            deltaY = targetRock ? (targetRock.top - obj.top) / 10 : 0;
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

    // Helper function to calculate distance between two objects
    const calculateDistance = (obj1, obj2) => {
        return Math.sqrt((obj1.left - obj2.left) ** 2 + (obj1.top - obj2.top) ** 2);
    };




    // Use an effect to continuously update the game object positions
    useEffect(() => {
        const interval = setInterval(updateGameObjects, 500); // Adjust the time interval as needed
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