import React, {useState} from 'react';
import Reviews from './Reviews';
import { Button, UncontrolledPopover, PopoverBody } from 'reactstrap';
import './RestaurantInfo.css';
import { AddGoodMatch } from './firestore_utils';
import { QueryResult } from './FoodFinder';

interface RestaurantInfoProps {
    results: Array<QueryResult> | null,
    numDisplay: number,
    queryType: string,
    query: string
}

const RestaurantInfo = (props: RestaurantInfoProps) => {
    const RestInfo = props.results != null ? props.results.map((result, i) => {
            const direct_url = `https://google.com/search?q=${result.name} ${result.address}`
            // console.log(result.summary);
            if (i < props.numDisplay) {
                return (
                    <div className="row rest-container border-bottom mb-4" key={i}>
                        <a href={direct_url} className="rest-link">
                            <Button className="rest-button pb-2">
                                <i className="fa fa-external-link-square fa-lg fa-fw"></i>
                            </Button>
                        </a>
                        { props.queryType === "Semantic" && 
                                <Button className="rest-like rest-button pb-2" 
                                        onClick={() => {
                                            AddGoodMatch(props.query, result.name, result.address);
                                        }}>
                                    <i className="fa fa-heart fa-lg fa-fw" id={`like-rest-${i}`}></i>
                                    {/* <UncontrolledPopover trigger="hover" placement="bottom" target={`like-rest-${i}`}>
                                        <PopoverBody>
                                            Give a like if think this is a good recommendation!
                                        </PopoverBody>
                                    </UncontrolledPopover> */}
                                    <UncontrolledPopover trigger="legacy" placement="bottom" target={`like-rest-${i}`}>
                                        <PopoverBody>
                                        Thank you for your input!
                                        </PopoverBody>
                                    </UncontrolledPopover>
                                </Button>
                        }
                        <h2 className="w-100 mb-2">
                            <div className="row">
                                <div className="col-6 col-md-5">
                                    <a href={direct_url} className="name-link rest-title">
                                        <b>{result.name}</b>
                                    </a>
                                </div>
                                <div className="rest-info col-4 d-flex justify-content-start mt-1">
                                    <small>Rating: {result.rating.toFixed(2)} / 5</small>
                                </div>
                            </div>
                        </h2>
                        <div className="w-100 mb-2">
                            <h3 className="mb-0">
                                <b className="rest-info">Address:</b>
                            </h3>
                            <span>{result.address}</span>
                        </div>  
                        <div>
                            <div className="rest-info w-100 mb-0 ">
                                <div className="row">
                                    <div className="col-2">
                                        <h3><b>Summary:</b></h3>
                                    </div>
                                    <div className="col-1">
                                        <i className="fa fa-question-circle fa-lg pl-1 pr-1 mt-2 summary-info" id={`summary-info-${i}`}></i>
                                        <UncontrolledPopover trigger="click hover" placement="bottom" target={`summary-info-${i}`}>
                                            <PopoverBody>
                                                Most semantically 'central' sentences in reviews of <b>{result.name}</b>
                                            </PopoverBody>
                                        </UncontrolledPopover>
                                    </div>
                                </div>
                            </div>                        
                            <p className="rest-summary">
                                {result.summary}
                            </p>
                            <p>
                                Reviewed on tripadvisor.com.sg
                            </p>
                        </div>
                        <div className="w-100">
                            <Reviews restaurant_name={result.name} address={result.address} />
                        </div>
                    </div>
                );
            }
            else {
                return (<div></div>);
            }
        }) : (<div></div>);

    return (
        <>
            <div className="container">
                {RestInfo}
            </div>
        </>
    )
}

export default RestaurantInfo;