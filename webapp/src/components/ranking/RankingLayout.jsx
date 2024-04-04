import React, { useState, useEffect } from "react";
import RankingsTable from "./RankingTable";

const apiEndpoint =  process.env.REACT_APP_API_ENDPOINT ||'http://localhost:8000';

const RankingsLayout = () => {
    const [filter, setFilter] = useState('global'); // default ranking = global
    
    const handleFilterClick = (filter) => {
        setFilter(filter);
    }

    return (
        <div className="flex h-screen bg-white">
            <div id="sidebar" className="md:flex flex-col w-64 bg-gray-800">
                <div className="flex items-center justify-center h-16 bg-gray-900">
                    <span className="font-bold text-white">Rankings</span>
                </div>
                <div id="categories" className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 bg-gray-800">
                        <button className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                            onClick={() => handleFilterClick('global')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            Global
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                            onClick={() => handleFilterClick('flags')}>
                            Flags
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                            onClick={() => handleFilterClick('cities')}>
                            Cities
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                            onClick={() => handleFilterClick('monuments')}>
                            Monuments
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                            onClick={() => handleFilterClick('foods')}>
                            Food
                        </button>
                    </nav>
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="flex items-center px-4">
                    <h1 className="text-2xl font-bold uppercase">{filter}</h1>
                </div>
                <div className="p-4" id="table">
                    <RankingsTable filter={filter} />
                </div>
            </div>
        </div>
    )
}

export default RankingsLayout;