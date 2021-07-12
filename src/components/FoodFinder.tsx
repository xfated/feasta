import React, { useState, useEffect } from 'react';
import './FoodFinder.css';
import QueryForm from './QueryForm';
import RestaurantInfo from './RestaurantInfo';
import Limitations from './Limitations';
import FeedbackForm from './FeedbackForm';
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

var base_url:string = "http://127.0.0.1:8000";

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
        setQueryStatus("Loading");
        setNumDisplay(5);
        let end_point:string = "";
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
        let requestURL:string = base_url + `/${end_point}`;
        let predictURL:string = requestURL + '/predict';
        // console.log(values);
        // console.log(requestURL);
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
                let resultURL:string = base_url + `/result/${task_id}`;
                callGetResults(resultURL);
            })
            .catch( (err) => {
                setQueryStatus("Failed");
                setFailureMessage(err.toString());
                console.log(err);
            });
        
        // alert("Submission:" + JSON.stringify(values));
    }   

    // Display results
    const [numDisplay, setNumDisplay] = useState(5);
    const QueryDisplay = () => {
        if (queryStatus === 'Success' && results != null) {
            return (
                <div>
                    <div className="w-100 flex flex-horizontal-center">
                        <p>{results.length} results found</p>
                    </div>
                    <RestaurantInfo results={results} numDisplay={numDisplay}/>
                    { results.length > numDisplay && 
                        <div className="w-100 flex flex-horizontal-center">
                            <Button onClick={() => setNumDisplay(numDisplay + 5)} className="button more-button pt-0 pb-0">
                                More <br />
                                <i className="fa fa-angle-down"></i>
                            </Button>
                        </div>
                    }
                </div>
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
            <div className="section-header col-12 text-center pb-3">
                <div className="col-12 flex flex-horizontal-center mb-3">
                    <h1 className="mb-0 col-6 col-sm-5 header-underline">Where to feast?</h1>
                </div>
                <p>Options for when you're out of options.</p>
            </div>
            <Limitations />
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
            {/* Test button */}
            {/* <Button style={{backgroundColor:'green', zIndex:1}} onClick={() => {
                    if (results === null){
                        console.log("it is null");
                    }
                    // console.log(results);
                    // console.log(queryStatus);
                    // console.log
                    }}>
                Test
            </Button> */}
            <FeedbackForm/>
        </>
    )
}

export default FoodFinder;