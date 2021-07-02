import React, { useState } from 'react';
import './FoodFinder.css';

const FoodFinder = () => {
    // Data for controlled form. TO make query
    const [query, setQuery] = useState({
        query: "",
        postal: "",
        topk: 0,
    });
    type queryMode = "random" | "embed";
    const [queryMode, setQueryMode] = useState<queryMode>("random");

    return(
        <>
        </>
    )
}

export default FoodFinder;
