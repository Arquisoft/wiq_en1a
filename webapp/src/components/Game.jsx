import React, { useState } from "react";
import axios from "axios";
import Question from "./Question";

const Game = () => {
    const [gameStarted, setGameStarted] = useState(false);

    const startGame = () => {
        setGameStarted(!gameStarted);
    };

    return (
        <div>
            {gameStarted ? (
                <Question />
            ) : (
                <div className="flex flex-col items-center justify-center mt-16">
                    <h1 className="text-6xl font-bold text-zinc-700">Welcome to WIQ!</h1>
                    <button onClick={startGame} className="mt-10 border border-blue-500 text-blue-500 font-bold text-2xl py-2 px-4 rounded-full 
                        transition-transform transform-gpu hover:scale-105">
                    Play
                    </button>
                </div>
            )}
        </div>
    )
};

export default Game;