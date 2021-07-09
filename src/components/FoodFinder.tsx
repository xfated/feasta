import React, { useState, useEffect } from 'react';
import './FoodFinder.css';
import QueryForm from './QueryForm';
import RestaurantInfo from './RestaurantInfo';
import { Button, Spinner } from 'reactstrap';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// Define interfaces for our results
export interface QueryResult {
    name:string,
    address:string,
    tags:Array<string>,
    about:string,
    summary:string,
    link:string,
    rating:number
}

// type QueryType = "Random" | "Semantic";
export interface Query {
    postal: string;
    region: string;
    topk: number;
    querytype: string;
    query: string;
}

var url:string = "http://127.0.0.1:8000";

const FoodFinder = () => {
    
    // Store results
    const [results, setResults] = useState<null | Array<QueryResult>>();

    // Handle processing
    type queryStatusType = "Start" | "Loading" | "Failed" | "Success";
    const [queryStatus, setQueryStatus] = useState<queryStatusType>("Start");
    const [failureMessage, setFailureMessage] = useState<null | string>(null);
    // For loading
    const waitPhrases = [
        "Interviewing strangers on the street...",
        "Trying out the food...",
        "Searching for restaurants...",
    ]
    const [waitPhraseIdx, setWaitPhraseIdx] = useState(0);
    
    useEffect(() => {
        // display phrases every interval while results are loading
        if (queryStatus === 'Loading') {
            const displayPhrases = setInterval(() => {
                var idx = Math.floor(Math.random() * waitPhrases.length);
                setWaitPhraseIdx(idx);
            }, 2000);
            return () => clearInterval(displayPhrases);
        }
    }, [queryStatus, waitPhrases.length])

    // Function to make request and store results
    // Use interval polling to fetch result
    const [tries, setTries] = useState(0);
    async function getResults(resultURL:string){
        const resultOptions = {
            method: 'GET',
        }
        let data = null;
        try {
            let response = await fetch(resultURL, resultOptions);
            data = await response.json();
        } catch (e) {
            console.error(e);
            setFailureMessage(e);
            return false;
        }
        if (data === null) {
            return false; 
        }
        let status:string = data['status']
        // console.log(data);
        // console.log(status);
        if (status !== "Processing") {
            setResults(data['preds']);
            setQueryStatus("Success");
            // console.log(data['preds']);
            setFailureMessage(null);
            return true;
        }
        return false;
    }
    function callGetResults(resultURL:string) {
        // Get results
        const getResult = setInterval(() => {
            // console.log(`try: ${tries}`);
            getResults(resultURL)
                .then((success) => {
                    if (success || tries > 10) {
                        clearInterval(getResult);
                        setTries(0);
                        // console.log('success');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setTries(tries + 1);
                });
            setTries(tries + 1);
        }, 500);   

    }

    const handleQuery = (values: Query) => {
        setQueryStatus("Loading")
        let end_point:string = ""
        console.log(values.querytype);
        if (values.querytype === "Top Rated"){
            // Postal selected
            if (values.postal.length !== 0){
                end_point = "restTopkPostal";
            }   
            // Region selected
            else if (values.region.length !== 0)
                end_point = "restTopkRegion";
            else
                end_point = "restTopk"; 
        }
        else if (values.querytype === "Random" || values.query.length === 0){
            // Postal selected
            if (values.postal.length !== 0){
                end_point = "restRandomPostal";
            }   
            // Region selected
            else if (values.region.length !== 0)
                end_point = "restRandomRegion";
            else
                end_point = "restRandom"; 
        }
        else {
            // Postal selected
            if (values.postal.length !== 0)
                end_point = "restFinderPostal"
            // Region selected
            else if (values.region.length !== 0)
                end_point = "restFinderRegion"
            else 
                end_point = "restFinder"
        }
        let requestURL:string = url + `/${end_point}`;
        let predictURL:string = requestURL + '/predict';
        // console.log(values);
        console.log(requestURL);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'input_text': values.query,
                'top_k': values.topk,
                'postal': values.postal,
                'region': values.region
            })
        }
        
        fetch(predictURL, requestOptions)
            .then(response => response.json())
            .then((data) => {
                let task_id:string = data['task_id'];
                let resultURL:string = requestURL + `/result/${task_id}`;
                callGetResults(resultURL);
            })
            .catch( (err) => {
                setQueryStatus("Failed");
                setFailureMessage(err.toString());
                console.log(err);
            });
        
        // alert("Submission:" + JSON.stringify(values));
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
                <div></div>
            )
        }
        if (queryStatus === 'Failed') {
            return (
                <div className="text-center">
                    <p>Query failed :(</p>
                    <p>{failureMessage}</p>
                </div>
            )
        }
        return (<div className="placeholder">
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
            <div className="results-container w-100">
                <div className="row flex flex-horizontal-center">
                    { (queryStatus === "Loading") && 
                        <div className="col-12 flex flex-horizontal-center mb-5">
                            <Spinner style={{ width: '3rem', height: '3rem' }} />
                        </div>
                    }
                    <div className="col-12 text-center">              
                        <TransitionGroup>
                            <CSSTransition
                                    timeout={1000}
                                    key={waitPhraseIdx}
                                    classNames="waitphrase"
                                    >    
                                {   (queryStatus === "Loading") ?                     
                                        <span>
                                            {waitPhrases[waitPhraseIdx]}
                                        </span>
                                        :
                                        <span>&nbsp;</span>
                                }                      
                            </CSSTransition>
                        </TransitionGroup>
                    </div>
                    <QueryDisplay />
                </div>
            </div>
            <Button style={{backgroundColor:'green', zIndex:1}} onClick={() => {
                    if (results === null){
                        console.log("it is null");
                    }
                    // console.log(results);
                    // console.log(queryStatus);
                    // console.log
                    }}>
                Test
            </Button>
        </>
    )
}

export default FoodFinder;