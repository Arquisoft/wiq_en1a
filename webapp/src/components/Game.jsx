import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Question from "./Question";

const Game = () => {
    const [flagGameStarted, setFlagGameStarted] = useState(false);
    const [cityGameStarted, setCityGameStarted] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const auth = useAuthUser();
    const startFlagsGame = () => {
        setFlagGameStarted(!flagGameStarted);
    };
    const startCitiesGame = () => {
        setCityGameStarted(!cityGameStarted);
    };
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div>
            {isAuthenticated()? (flagGameStarted || cityGameStarted) ?(
                <div>
                    {flagGameStarted && <Question type="imgs" category="flags"/>}
                    {cityGameStarted && <Question type="imgs" category="cities"/>}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-16">
                    <h1 className="text-6xl font-bold text-zinc-700">{auth.username}, Let's Play!</h1>
                    <button onClick={startFlagsGame} className="mt-10 border border-blue-500 text-blue-500 font-bold text-2xl py-2 px-4 rounded-full 
                        transition-transform transform-gpu hover:scale-105">
                    Guess the flag
                    </button>
                    <button onClick={startCitiesGame} className="mt-10 border border-blue-500 text-blue-500 font-bold text-2xl py-2 px-4 rounded-full 
                        transition-transform transform-gpu hover:scale-105">
                    Guess the city
                    </button>
                </div>
            ):""}
        </div>
    )
};

export default Game;