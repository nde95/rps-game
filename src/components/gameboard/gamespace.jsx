import React, { useState, useEffect } from 'react';
import GameObject from './gameobject';
import './game.css';
import snippingSound from '../../assets/sounds/snip.mp3'

const GameSpace = ({ numberOfID1, numberOfID2, numberOfID3, onGameOver }) => {

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
                top: (window.innerHeight / 3) * 2.5 + Math.random() * (window.innerHeight / 3), // Top within the bottom third
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
        setGameObjects((prevGameObjects) => {
            const updatedGameObjects = prevGameObjects.map((obj) => {
                let deltaX = 0;
                let deltaY = 0;

                // Declare variables outside the switch
                let targetRock, targetPaper, targetScissors;

                // Use a fixed pixel distance for movement
                let stepSize = 0;

                if (obj.state === 'avoiding') {
                    stepSize = 4.5;
                } else {
                    stepSize = 6;
                }

                // const stepSize = 6; // Adjust as needed

                // Filter objects to get only the relevant targets for each instance
                const otherObjects = prevGameObjects.filter((targetObj) => targetObj.id !== obj.id);

                // Calculate closest Rock
                targetRock = otherObjects
                    .filter((targetObj) => targetObj.id === 2)
                    .reduce((closest, targetObj) => {
                        const distance = calculateDistance(obj, targetObj);
                        return distance < calculateDistance(obj, closest) ? targetObj : closest;
                    }, null);

                // Calculate closest Paper
                targetPaper = otherObjects
                    .filter((targetObj) => targetObj.id === 3)
                    .reduce((closest, targetObj) => {
                        const distance = calculateDistance(obj, targetObj);
                        return distance < calculateDistance(obj, closest) ? targetObj : closest;
                    }, null);

                // Calculate closest Scissors
                targetScissors = otherObjects
                    .filter((targetObj) => targetObj.id === 1)
                    .reduce((closest, targetObj) => {
                        const distance = calculateDistance(obj, targetObj);
                        return distance < calculateDistance(obj, closest) ? targetObj : closest;
                    }, null);

                // Adjust movement based on distances
                switch (obj.id) {
                    case 1: // Scissors
                        // Adjust movement based on distances
                        if (targetRock) {
                            const distanceToRock = calculateDistance(obj, targetRock);
                            const distanceToPaper = targetPaper ? calculateDistance(obj, targetPaper) : Number.POSITIVE_INFINITY;

                            // Check for catching
                            if (distanceToRock < 50) {
                                // console.log('Scissors caught by Rock');
                                return { ...obj, id: 2 }; // Update ID and state                              
                            }

                            // Adjust movement based on distances
                            if (distanceToRock < distanceToPaper && distanceToRock < 100) {
                                // console.log('Scissors Avoiding Rock');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetRock.left > 0 ? stepSize : -stepSize);
                                deltaY = (obj.top - targetRock.top > 0 ? stepSize : -stepSize);
                            } else {
                                // console.log('Scissors Seeking Paper');
                                obj.state = 'seeking';
                                deltaX = targetPaper ? (targetPaper.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                                deltaY = targetPaper ? (targetPaper.top - obj.top > 0 ? stepSize : -stepSize) : 0;
                            }
                        } else {
                            // console.log('Scissors Seeking Paper');
                            obj.state = 'seeking';
                            deltaX = targetPaper ? (targetPaper.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                            deltaY = targetPaper ? (targetPaper.top - obj.top > 0 ? stepSize : -stepSize) : 0;
                        }
                        break;

                    case 2: // Rock
                        // Adjust movement based on distances
                        if (targetPaper) {
                            const distanceToPaper = calculateDistance(obj, targetPaper);
                            const distanceToScissors = targetScissors ? calculateDistance(obj, targetScissors) : Number.POSITIVE_INFINITY;

                            // Check for catching
                            if (distanceToPaper < 50) {
                                // console.log('Rock caught by Paper');
                                return { ...obj, id: 3 }; // Update ID and state
                            }

                            // Adjust movement based on distances
                            if (distanceToPaper < distanceToScissors && distanceToPaper < 100) {
                                // console.log('Rock Avoiding Paper');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetPaper.left > 0 ? stepSize : -stepSize);
                                deltaY = (obj.top - targetPaper.top > 0 ? stepSize : -stepSize);
                            } else {
                                // console.log('Rock Seeking Scissors');
                                obj.state = 'seeking';
                                deltaX = targetScissors ? (targetScissors.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                                deltaY = targetScissors ? (targetScissors.top - obj.top > 0 ? stepSize : -stepSize) : 0;
                            }
                        } else {
                            // console.log('Rock Seeking Scissors');
                            obj.state = 'seeking';
                            deltaX = targetScissors ? (targetScissors.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                            deltaY = targetScissors ? (targetScissors.top - obj.top > 0 ? stepSize : -stepSize) : 0;
                        }
                        break;

                    case 3: // Paper
                        // Adjust movement based on distances
                        if (targetScissors) {
                            const distanceToScissors = calculateDistance(obj, targetScissors);
                            const distanceToRock = targetRock ? calculateDistance(obj, targetRock) : Number.POSITIVE_INFINITY;

                            // Check for catching
                            if (distanceToScissors < 50) {
                                // console.log('Paper caught by Scissors');
                                return { ...obj, id: 1 }; // Update ID and state
                            }

                            // Audio option after muted and game start is added 
                            // if (!muted && distanceToScissors < 50) {
                            //     // console.log('Paper caught by Scissors');
                            //     const snipped = new Audio(snippingSound)
                            //     snipped.play()
                            //     return { ...obj, id: 1 }; // Update ID and state
                            // }

                            // Adjust movement based on distances
                            if (distanceToScissors < distanceToRock && distanceToScissors < 100) {
                                // console.log('Paper Avoiding Scissors');
                                obj.state = 'avoiding';
                                deltaX = (obj.left - targetScissors.left > 0 ? stepSize : -stepSize);
                                deltaY = (obj.top - targetScissors.top > 0 ? stepSize : -stepSize);
                            } else {
                                // console.log('Paper Seeking Rock');
                                obj.state = 'seeking';
                                deltaX = targetRock ? (targetRock.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                                deltaY = targetRock ? (targetRock.top - obj.top > 0 ? stepSize : -stepSize) : 0;
                            }
                        } else {
                            // console.log('Paper Seeking Rock');
                            obj.state = 'seeking';
                            deltaX = targetRock ? (targetRock.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                            deltaY = targetRock ? (targetRock.top - obj.top > 0 ? stepSize : -stepSize) : 0;
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
        // Check if obj2 is defined before accessing its properties
        if (obj2) {
            return Math.sqrt((obj1.left - obj2.left) ** 2 + (obj1.top - obj2.top) ** 2);
        } else {
            // Return a default value or handle the case when obj2 is undefined
            return Number.POSITIVE_INFINITY;
        }
    };




    // Use an effect to continuously update the game object positions
    useEffect(() => {
        const interval = setInterval(updateGameObjects, 100); // Adjust the time interval as needed
        return () => clearInterval(interval); // Clean up the interval on unmount
    }, []);

    useEffect(() => {
        const remainingIDs = new Set(gameObjects.map((obj) => obj.id));
        if (remainingIDs.size === 1) {
            // Game over, trigger the callback
            onGameOver();
        }
    }, [gameObjects, onGameOver]);

    return (
        <div id="game-space">
            {gameObjects.map((gameObject) => (
                <GameObject key={gameObject.renderKey} {...gameObject} />
            ))}
        </div>
    );
};

export default GameSpace;