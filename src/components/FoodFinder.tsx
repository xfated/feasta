import React, { useState } from 'react';
import './FoodFinder.css';
import QueryForm from './QueryForm';

// Define interfaces for our results
interface QueryResult {
}

// type QueryType = "Random" | "Semantic";
export interface Query {
    postal: string;
    topk: number;
    querytype: string;
    query: string;
}

var url:string = "http://127.0.0.1:8000";

const FoodFinder = () => {
    
    const [results, setResults] = useState<Array<null | QueryResult>>()
    
    // Function to make request and store results
    const handleQuery = (values: Query) => {
        alert("Submission:\n" + JSON.stringify(values))
        return
    }   

    return(
        <>  
            <div className="divider"></div>
            <div className="section-header col-12 text-center">
                <div className="col-12 flex flex-horizontal-center mb-3">
                    <h1 className="mb-0 col-6 col-sm-4 header-underline">Where to feast?</h1>
                </div>
                <p>Some suggestions for when you're out of options.</p>
            </div>
            <div className="query-container pb-5">
                <QueryForm handleQuery={handleQuery}/>
            </div>
        </>
    )
}

export default FoodFinder;