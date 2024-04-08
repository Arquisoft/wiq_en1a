import React, { useState, useEffect } from "react";
import RankingsTable from "./RankingTable";

const RankingsLayout = () => {
    const [filter, setFilter] = useState('global'); // default ranking = global
    
    const handleFilterClick = (filter) => {
        setFilter(filter);
    }

    return (
        <div className="flex h-screen">
            <div id="sidebar" className="md:flex flex-col w-48 bg-[#504185]">
                <div className="flex items-center justify-center h-16 bg-[#322653]">
                    <span className="text-xl font-bold text-white">Rankings</span>
                </div>
                <div id="categories" className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 bg-gradient-to-b
                        from-[#3a2f60] from-10% to-[#504185] to-60%">
                        <button className="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#73689b]"
                            onClick={() => handleFilterClick('global')}>
                            Global
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#73689b]"
                            onClick={() => handleFilterClick('flags')}>
                            Flags
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#73689b]"
                            onClick={() => handleFilterClick('cities')}>
                            Cities
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#73689b]"
                            onClick={() => handleFilterClick('monuments')}>
                            Monuments
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#73689b]"
                            onClick={() => handleFilterClick('foods')}>
                            Foods
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-100 rounded-lg hover:bg-[#73689b]"
                            onClick={() => handleFilterClick('tourist_attractions')}>
                            Attractions
                        </button>
                    </nav>
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="flex items-center px-4 h-16">
                    <h1 className="text-4xl font-bold uppercase text-[#4d3b7f]">{filter}</h1>
                </div>
                <div className="p-4" id="table">
                    <RankingsTable filter={filter} />
                </div>
            </div>
        </div>
    )
}

export default RankingsLayout;