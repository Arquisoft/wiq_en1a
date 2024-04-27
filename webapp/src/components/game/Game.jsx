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
        <div class="area">
            <ul class="circles">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" style={{ height: "92.9vh" }}>
            {isAuthenticated() ? (flagGameStarted || cityGameStarted || monumentGameStarted
                || touristAttractionGameStarted || foodGameStarted) ? (
                <div className="flex justify-center content-center pt-10 h-auto">
                    {flagGameStarted && <Question type="imgs" category="flags" />}
                    {cityGameStarted && <Question type="imgs" category="cities" />}
                    {monumentGameStarted && <Question type="imgs" category="monuments" />}
                    {touristAttractionGameStarted && <Question type="imgs" category="tourist_attractions" />}
                    {foodGameStarted && <Question type="imgs" category="foods" />}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-6xl font-bold text-center text-white pt-5">{auth.username}, Let's Play! Guess the...</h1>
                    <div className="grid grid-cols-1 p-7 gap-5">
                        <button onClick={startFlagsGame} className="w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 
                        transition-transform transform-gpu hover:scale-105">
                            Flag
                        </button>
                        <button onClick={startCitiesGame} className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10
                        transition-transform transform-gpu hover:scale-105">
                            City
                        </button>
                        <button onClick={startMonumentsGame} className="w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10  
                        transition-transform transform-gpu hover:scale-105">
                            Monument
                        </button>
                        <button onClick={startTouristAttractionsGame} className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10
                        transition-transform transform-gpu hover:scale-105">
                            Tourist attraction
                        </button>
                        <button onClick={startFoodsGame} className="w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10  
                        transition-transform transform-gpu hover:scale-105">
                            Food
                        </button>
                    </div>
                </div>
            ) : ""}
        </div>
        </div>
    )
};

export default Game;