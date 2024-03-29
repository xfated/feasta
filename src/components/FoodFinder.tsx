import React, { useState, useEffect } from 'react';
import './FoodFinder.css';
import QueryForm from './QueryForm';
import RestaurantInfo from './RestaurantInfo';
import Limitations from './Limitations';
import FeedbackForm from './FeedbackForm';
import { AddQuery } from './firestore_utils';
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

// type QueryType = "Random" | "Semantic" | "Top K";
export interface Query {
    postal: string;
    region: string;
    topk: number;
    querytype: string;
    query: string;
}

const base_url = process.env.REACT_APP_baseURL;
const logQueries = false;

const FoodFinder = () => {
    
    // Store results
    const [results, setResults] = useState<null | Array<QueryResult>>();

    // Handle processing
    type queryStatusType = "Start" | "Loading" | "Failed" | "Success";
    const [queryStatus, setQueryStatus] = useState<queryStatusType>("Start");
    const [failureMessage, setFailureMessage] = useState<null | string>(null);
    const [queryType, setQueryType] = useState(''); // To identify if want to record matching
    const [query, setQuery] = useState('');

    // For loading
    const waitPhrases = [
        "Interviewing strangers on the street...",
        "Trying out the food...",
        "Searching for restaurants...",
        "Distracted by neighbourhood cats...",
        "Stopped at the traffic light...",
        "Inspecting breadcrumbs...",
        "Drinking some coffee..."
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
    const [resultURL, setResultURL] = useState('');
    const [fetchResults, setFetchResults] = useState(false);
    
    useEffect(() => {
        async function getResults(){
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
            let err:string = data['error']
            // console.log(err);
            if ( err === "ConnectionError") {
                setQueryStatus("Failed");
                setFailureMessage("Language model is not available at the moment");
                // console.log('failed');
                return false;
            }
            if (status !== "Processing") {
                setResults(data['preds']);
                setQueryStatus("Success");
                // console.log(data['preds']);
                setFailureMessage(null);
                return true;
            }
            return false;
        }

        if (fetchResults){
            const callGetResult = setTimeout(() => {
                console.log(`Getting results try: ${tries}`);
                getResults()
                    .then((success) => {
                        if (success) {
                            setTries(0);
                            setFetchResults(false);
                            // console.log('success');
                        }
                        else if (tries >= 10){
                            setTries(0);
                            setFetchResults(false);
                            setQueryStatus("Failed");
                            setFailureMessage("Query took too long. Weird. Please try again!");
                        }
                        else {
                            setTries(tries + 1);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        if (tries >= 5){
                            setTries(0);
                            setFetchResults(false);
                            setQueryStatus("Failed");
                            setFailureMessage("Query took too long. Weird. Please try again!");
                        }
                        else {
                            setTries(tries + 1);
                        }
                    });  
            }, 2000);   
            return () => {
                clearTimeout(callGetResult);
            }
        }
    }, [fetchResults, tries, resultURL])

    const handleQuery = (values: Query) => {
        setQueryStatus("Loading");
        setNumDisplay(5);
        setTries(0);
        let end_point:string = "";
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
                // let resultURL:string = base_url + `/result/${task_id}`;
                setResultURL(base_url + `/result/${task_id}`);
                setFetchResults(true);

                setQueryType(values.querytype);
                setQuery(values.query);
                // Store query on successful submits
                if (logQueries){
                    AddQuery(values.query, values.postal, values.topk, values.querytype, values.region);
                }
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
                        <p className="mb-0">{results.length} results found</p>
                    </div>
                    { queryType === "Text Query" && 
                        <div className="col-12 text-center">
                            <p className="add-info ml-2 mr-2">Please 'Like' the search result if you think it matches your query well!</p>
                        </div>
                    }
                    <div className="col-12 text-center pb-3">
                        <p className="add-info ml-2 mr-2">Also, <b>please do give a review</b> so that these eateries get the attention they deserve!</p>
                    </div>
                    <div className="col-12 text-center pb-3">
                        <p className="add-info ml-2 mr-2">P.S. Ratings shown are obtained by calculating the average of the reviews I had initially gathered online.</p>
                    </div>
                    <div className="restaurant-info-box">
                        <RestaurantInfo results={results} numDisplay={numDisplay} queryType={queryType} query={query}/>
                    </div>
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
            <div className="hide-overflow">
                <Limitations />
            </div>
            <div
                style={{
                    width: "100%",
                    textAlign: "center",
                    color: "red",
                    fontSize: "1.5em",
                    paddingBottom: "10px"
                }}
            >{"NOTE: The backend has been taken down because it is expensive :("}</div>
            <div className="query-container pb-5">
                <QueryForm handleQuery={handleQuery}/>
            </div>
            <div className="results-container hide-overflow">
                <div className="row pr-0 pl-0 flex flex-horizontal-center ">
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
            { queryStatus === 'Success' &&
                <div className="col-12 text-center pb-3">
                    <p className="disclaimer-info ml-2 mr-2">Do contact me (email at the bottom) if you think a restaurant should be added to this website!</p>
                </div>
            }
            {/* Test button */}
            {/* <Button style={{backgroundColor:'green', zIndex:1}} onClick={() => {
                    if (results === null){
                        console.log("it is null");
                    }
                    console.log(firebase.auth().currentUser);
                    const uid = firebase.auth().currentUser?.uid;
                    console.log(uid);
                    // console.log(results);
                    // console.log(queryStatus);
                    // console.log
                    }}>
                Test
            </Button> */}
            <div className="hide-overflow">
                <FeedbackForm/>
            </div>
        </>
    )
}

export default FoodFinder;