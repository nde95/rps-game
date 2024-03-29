import React, { useState, useEffect } from 'react';
import GameObject from './gameobject';
import './game.css';
import snippingSound from '../../assets/sounds/snip.mp3'
import crushingSound from '../../assets/sounds/rock.mp3'
import crumpleSound from '../../assets/sounds/crumple.mp3'

const GameSpace = ({ numberOfID1, numberOfID2, numberOfID3, onGameOver, muted, chaosMode }) => {
    const [gameOver, setGameOver] = useState(false);
    const [snippingAudio, setSnippingAudio] = useState(new Audio(snippingSound));
    const [crushingAudio, setCrushingAudio] = useState(new Audio(crushingSound));
    const [crumpleAudio, setCrumpleAudio] = useState(new Audio(crumpleSound));

    const generateGameObjects = () => {
        const objects = [];

        for (let i = 1; i <= numberOfID1; i++) {
            // Create ID 1 (Scissors) objects in the top left third
            objects.push({
                id: 1,
                lastCaptureTime: 0,
                left: chaosMode ? Math.random() * window.innerWidth : Math.random() * (window.innerWidth / 3),
                top: chaosMode ? Math.random() * window.innerHeight : Math.random() * (window.innerHeight / 3),
            });
        }

        // Generate ID 2 (Rocks) objects
        for (let i = 1; i <= numberOfID2; i++) {
            objects.push({
                id: 2,
                lastCaptureTime: 0,
                left: chaosMode ? Math.random() * window.innerWidth : (window.innerWidth / 3) * 2 + Math.random() * (window.innerWidth / 3),
                top: chaosMode ? Math.random() * window.innerHeight : Math.random() * (window.innerHeight / 3),
            });
        }

        // Generate ID 3 (Papers) objects
        for (let i = 1; i <= numberOfID3; i++) {
            objects.push({
                id: 3,
                lastCaptureTime: 0,
                left: chaosMode ? Math.random() * window.innerWidth : (window.innerWidth / 3) + Math.random() * (window.innerWidth / 3),
                top: chaosMode ? Math.random() * window.innerHeight : (window.innerHeight / 3) * 2.5 + Math.random() * (window.innerHeight / 3),
            });
        }

        return objects.map((obj, index) => ({
            ...obj,
            renderKey: obj.id + '-' + index, // Use a separate key for rendering
        }));
    };

    const [gameObjects, setGameObjects] = useState(generateGameObjects);

    useEffect(() => {
        // Preload audio when the component mounts
        snippingAudio.load();
        crushingAudio.load();
        crumpleAudio.load();

        // Clean up the audio objects when the component unmounts
        return () => {
            snippingAudio.pause();
            snippingAudio.currentTime = 0;
            crushingAudio.pause();
            crushingAudio.currentTime = 0;
            crumpleAudio.pause();
            crumpleAudio.currentTime = 0;
        };
    }, [snippingAudio, crushingAudio, crumpleAudio]);

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

                const getRandomCaptureInterval = () => {
                    // Adjust the minimum and maximum values as needed
                    const minInterval = 200;
                    const maxInterval = 1000;

                    return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
                };

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
                            if (distanceToRock < 30 && obj.lastCaptureTime + getRandomCaptureInterval() < Date.now()) {
                                if (!muted) {
                                    crushingAudio.play();
                                }
                                return { ...obj, id: 2, lastCaptureTime: Date.now() }; // Update ID and state
                            }


                            // Adjust movement based on distances
                            if (distanceToRock < distanceToPaper && distanceToRock < 100) {
                                obj.state = 'avoiding';
                                deltaX = obj.left - targetRock.left > 0 ? stepSize : -stepSize;
                                deltaY = obj.top - targetRock.top > 0 ? stepSize : -stepSize;
                            } else {
                                obj.state = 'seeking';
                                deltaX = targetPaper ? (targetPaper.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                                deltaY = targetPaper ? (targetPaper.top - obj.top > 0 ? stepSize : -stepSize) : 0;
                            }
                        } else {
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
                            if (distanceToPaper < 30 && obj.lastCaptureTime + getRandomCaptureInterval() < Date.now()) {
                                if (!muted) {
                                    crumpleAudio.play();
                                }
                                return { ...obj, id: 3, lastCaptureTime: Date.now() }; // Update ID and state
                            }

                            // Adjust movement based on distances
                            if (distanceToPaper < distanceToScissors && distanceToPaper < 100) {
                                obj.state = 'avoiding';
                                deltaX = obj.left - targetPaper.left > 0 ? stepSize : -stepSize;
                                deltaY = obj.top - targetPaper.top > 0 ? stepSize : -stepSize;
                            } else {
                                obj.state = 'seeking';
                                deltaX = targetScissors ? (targetScissors.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                                deltaY = targetScissors ? (targetScissors.top - obj.top > 0 ? stepSize : -stepSize) : 0;
                            }
                        } else {
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
                            if (distanceToScissors < 30 && obj.lastCaptureTime + getRandomCaptureInterval() < Date.now()) {
                                if (!muted) {
                                    snippingAudio.play();
                                }
                                return { ...obj, id: 1, lastCaptureTime: Date.now() }; // Update ID and state
                            }

                            // Adjust movement based on distances
                            if (distanceToScissors < distanceToRock && distanceToScissors < 100) {
                                obj.state = 'avoiding';
                                deltaX = obj.left - targetScissors.left > 0 ? stepSize : -stepSize;
                                deltaY = obj.top - targetScissors.top > 0 ? stepSize : -stepSize;
                            } else {
                                obj.state = 'seeking';
                                deltaX = targetRock ? (targetRock.left - obj.left > 0 ? stepSize : -stepSize) : 0;
                                deltaY = targetRock ? (targetRock.top - obj.top > 0 ? stepSize : -stepSize) : 0;
                            }
                        } else {
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
        if (remainingIDs.size === 1 && !gameOver) {
            setGameOver(true);
            // Game over, trigger the callback with the winning ID
            const winnerId = remainingIDs.values().next().value;
            onGameOver(winnerId);
        }
    }, [gameObjects, onGameOver, gameOver]);

    return (
        <div id="game-space">
            {gameObjects.map((gameObject) => (
                <GameObject key={gameObject.renderKey} {...gameObject} />
            ))}
        </div>
    );
};

export default GameSpace;