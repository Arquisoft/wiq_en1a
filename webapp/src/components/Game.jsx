import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Question from "./Question";

const Game = () => {
    const [flagGameStarted, setFlagGameStarted] = useState(false);
    const [cityGameStarted, setCityGameStarted] = useState(false);
    const [monumentGameStarted, setMonumentGameStarted] = useState(false);
    const [touristAttractionGameStarted, setTouristAttractionGameStarted] = useState(false);
    const [foodGameStarted, setFoodGameStarted] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const auth = useAuthUser();
    const startFlagsGame = () => {
        setFlagGameStarted(!flagGameStarted);
    };
    const startCitiesGame = () => {
        setCityGameStarted(!cityGameStarted);
    };
    const startMonumentsGame = () => {
        setMonumentGameStarted(!monumentGameStarted);
    };
    const startTouristAttractionsGame = () => {
        setTouristAttractionGameStarted(!touristAttractionGameStarted);
    };
    const startFoodsGame = () => {
        setFoodGameStarted(!foodGameStarted);
    };
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div>
            {isAuthenticated()? (flagGameStarted || cityGameStarted || monumentGameStarted
                 || touristAttractionGameStarted || foodGameStarted) ?(
                <div>
                    {flagGameStarted && <Question type="imgs" category="flags"/>}
                    {cityGameStarted && <Question type="imgs" category="cities"/>}
                    {monumentGameStarted && <Question type="imgs" category="monuments"/>}
                    {touristAttractionGameStarted && <Question type="imgs" category="tourist_attractions"/>}
                    {foodGameStarted && <Question type="imgs" category="foods"/>}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-16">
                    <h1 className="text-6xl font-bold text-zinc-700">{auth.username}, Let's Play! Guess the...</h1>
                    <button onClick={startFlagsGame} className="mt-10 border border-blue-500 text-blue-500 font-bold text-2xl py-2 px-4 rounded-full 
                        transition-transform transform-gpu hover:scale-105">
                    Flag
                    </button>
                    <button onClick={startCitiesGame} className="mt-10 border border-blue-500 text-blue-500 font-bold text-2xl py-2 px-4 rounded-full 
                        transition-transform transform-gpu hover:scale-105">
                    City
                    </button>
                    <button onClick={startMonumentsGame} className="mt-10 border border-blue-500 text-blue-500 font-bold text-2xl py-2 px-4 rounded-full 
                        transition-transform transform-gpu hover:scale-105">
                    Monument
                    </button>
                    <button onClick={startTouristAttractionsGame} className="mt-10 border border-blue-500 text-blue-500 font-bold text-2xl py-2 px-4 rounded-full 
                        transition-transform transform-gpu hover:scale-105">
                    Tourist attraction
                    </button>
                    <button onClick={startFoodsGame} className="mt-10 border border-blue-500 text-blue-500 font-bold text-2xl py-2 px-4 rounded-full 
                        transition-transform transform-gpu hover:scale-105">
                    Food
                    </button>
                </div>
            ):""}
        </div>
    )
};

export default Game;