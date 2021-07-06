import React, { useState } from 'react';
import './FoodFinder.css';
import QueryForm from './QueryForm';
import RestaurantInfo from './RestaurantInfo';
import { Button, Spinner } from 'reactstrap';

// Define interfaces for our results
export interface QueryResult {
    name:string,
    address:string,
    tags:Array<string>,
    about:string,
    summary:string,
    // link:string
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
    
    const [results, setResults] = useState<null | Array<QueryResult>>();
    type queryStatusType = "Start" | "Loading" | "Failed" | "Success";
    const [queryStatus, setQueryStatus] = useState<queryStatusType>("Start");
    // // Define different possible search
    // const searchRandom = (values: Query) => {
    //     let task_id:string = "";
    //     // Make request for results
        
    // }
    // const searchRandomPostal = (values: Query): string => {
    //     let task_id:string = "";

    //     return task_id;
    // }
    // const searchSemantic = (values: Query) => {
    //     let task_id:string = "";
        
    //     return task_id;
    // }
    // const searchSemanticPostal = (values: Query) => {
    //     let task_id:string = "";
        
    //     return task_id;
    // }
    // Function to make request and store results
    async function getResults(resultURL:string, task_id: string) {
        // Get results
        const resultOptions = {
            method: 'GET',
        }
        let status:string = "Processing";
        let limit:number = 0
        while (status === "Processing" && limit < 10){
            limit += 1;
            let response = await fetch(resultURL, resultOptions);
            let data = await response.json()
            console.log(data);
            console.log(status)
            status = data['status']
            if (status !== "Processing") {
                setResults(data['preds']);
                setQueryStatus("Success");
                console.log(data['preds']);
            }
            else{
                // wait 1 second before trying to poll agian
                setTimeout(() => {}, 1000);
            }
        }
    }

    const handleQuery = (values: Query) => {
        setQueryStatus("Loading")
        let end_point:string = ""
        if (values.querytype === "Random" || values.query.length === 0){
            if (values.postal.length === 0)
                end_point = "restRandom";
            else
                end_point = "restRandomPostal";
        }
        else {
            if (values.postal.length === 0)
                end_point = "restFinder";
            else{
                end_point = "restFinderPostal";
            }
        }
        
        let requestURL:string = url + `/${end_point}`;
        let predictURL:string = requestURL + '/predict';

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'input_text': values.query,
                'top_k': values.topk,
                'postal': values.postal
            })
        }
        
        fetch(predictURL, requestOptions)
            .then(response => response.json())
            .then((data) => {
                let task_id:string = data['task_id'];
                let resultURL:string = requestURL + `/result/${task_id}`;
                getResults(resultURL, task_id);
            })
            .catch( (err) => {
                setQueryStatus("Failed")
                console.log(err);
            });
        
        // alert("Submission:" + JSON.stringify(values));
        return ''
    }   

    // const [queryDisplay, setQueryDisplay] = 
    const QueryDisplay = () => {
        if (queryStatus === 'Success' && results != null) {
            return (
                <RestaurantInfo results={results}/>
            )
        } 
        if (queryStatus === 'Loading') {
            return (
                <div>
                    <Spinner style={{ width: '3rem', height: '3rem' }} />
                </div>
            )
        }
        if (queryStatus === 'Failed') {
            return (
                <div>
                    <p>Failed</p>
                </div>
            )
        }
        return (<div className="placeholder test">
                    <p>Your results will be shown here.</p>
                </div>)
    }
    return(
        <>  
            <div className="divider"></div>
            <div className="section-header col-12 text-center">
                <div className="col-12 flex flex-horizontal-center mb-3">
                    <h1 className="mb-0 col-6 col-sm-4 header-underline">Where to feast?</h1>
                </div>
                <p>Options for when you're out of options.</p>
            </div>
            <div className="query-container pb-5">
                <QueryForm handleQuery={handleQuery}/>
            </div>
            <div className="flex flex-horizontal-center">
                <QueryDisplay />
            </div>
            <Button style={{backgroundColor:'green', zIndex:1}}onClick={() => {
                    if (results === null){
                        console.log("it is null");
                    }
                    console.log(results);
                    console.log(queryStatus);
                    }}>
                Test
            </Button>
        </>
    )
}

export default FoodFinder;