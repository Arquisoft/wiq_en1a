import React, { useEffect } from 'react';
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const isAuthenticated = useIsAuthenticated();
    let logged = isAuthenticated();
    const auth = useAuthUser();
    const navigate = useNavigate();
    useEffect(() => {

        if (isAuthenticated() === false) {
            logged = false;
        } else {
            logged = true;
        }

    }
        , [logged]);

    return (
        <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" style={{height: "92.9vh"}}>
            {logged ?
                <div>
                    
                    <h1 className="text-6xl font-bold mb-8 text-white">Welcome back, {auth.username}!</h1>
                    
                    
                    <div className="flex flex-col items-center justify-center">

                        <div className="basis-1 flex flex-col items-center justify-center">
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg " onClick={() => navigate("/play")}>
                            Start Playing
                        </button>
                        </div>
                        <div className="flex flex-row mt-5 " >
                            <button className=" flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg" onClick={() => navigate("/squads")}>
                                Squads
                            </button>
                            <div className="mx-1"/>
                            
                            <button className=" flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg" onClick={() => navigate("/userProfile")}>
                                My stats
                            </button>
                        </div>
                    </div>
                </div> :
                <div>
                    <h1 className="text-6xl font-bold mb-8 text-white">Welcome to WIQ, Please log in to play!</h1>
                    <div className="basis-1 flex flex-col items-center justify-center">
                    <button className=" flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg" onClick={() => navigate("/register")}>
                        Create account
                    </button>
                    </div>
                </div>
            }
        </div >
    );
};

export default MainPage;