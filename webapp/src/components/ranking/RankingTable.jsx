import React from "react";
import axios from "axios";

const RankingsTable = ({ filter }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold">{filter} table</h1>
        </div>
    )
}

export default RankingsTable;