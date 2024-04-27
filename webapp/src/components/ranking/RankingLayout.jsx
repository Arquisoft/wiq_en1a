import React, { useState } from "react";
import RankingsTable from "./RankingTable";

const RankingsLayout = () => {
    const [filter, setFilter] = useState('global'); // default ranking = global
    
    const handleFilterClick = (filter) => {
        setFilter(filter);
      
    }

    return (
        <div className="flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" style={{height: "92.9vh"}}>
            <div id="sidebar" className="sm:flex flex-col w-auto bg-[#4c2185]">
                <div className="flex items-center justify-center h-16 bg-[#4c2185]">
                    <span className="text-4xl font-bold text-white">Rankings</span>
                </div>
                <div id="categories" className=" align-center content-center bg-[#4c2185]">
                    <nav className="grid grid-cols-3 gap-3 lg:grid-cols-6 px-2 py-4 bg-[#4c2185]">
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                            onClick={() => handleFilterClick('global')}>
                            Global
                        </button>
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                            onClick={() => handleFilterClick('flags')}>
                            Flags
                        </button>
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                            onClick={() => handleFilterClick('cities')}>
                            Cities
                        </button>
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                            onClick={() => handleFilterClick('monuments')}>
                            Monuments
                        </button>
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                            onClick={() => handleFilterClick('foods')}>
                            Foods
                        </button>
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                            onClick={() => handleFilterClick('tourist_attractions')}>
                            Attractions
                        </button>
                    </nav>
                </div>
            </div>
            <div className="content-center align-center px-4 py-3 bg-[#4c2185]">
                    <h1 className="text-4xl text-center font-bold uppercase text-white">{filter==='tourist_attractions'?'Attractions':filter} Ranking</h1>
                </div>
            <div className="flex flex-col flex-1 overflow-y-auto bg-[#4c2185]">

                <div className="p-4" id="table">
                    <RankingsTable filter={filter} />
                </div>
            </div>
        </div>
    )
}

export default RankingsLayout;