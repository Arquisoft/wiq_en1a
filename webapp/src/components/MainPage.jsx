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
        
        if(isAuthenticated()===false) {
            logged = false;
        }else{
            logged = true;
        }  
               
    }
    , [logged]);

    return (
        <div className="flex flex-col items-center justify-center mt-16">
            {logged ?
                <div>
                <h1 className="text-6xl font-bold text-zinc-700">Welcome back, {auth.username}!</h1>
                <hr className=" my-8"/>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg" onClick={() => navigate("/play")}>
                    Start Playing
                </button>
            </div>:
                <div>
                    <h1 className="text-6xl font-bold text-zinc-700">Welcome to WIQ, Please log in to play!</h1>
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg" onClick={() => navigate("/register")}>
                        Create account
                    </button>
                </div>
            }
        </div >
    );
};

export default MainPage;