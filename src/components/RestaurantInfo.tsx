import React from 'react';
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

            // console.log(result.summary);
            if (i < props.numDisplay) {
                return (
                    <div className="row rest-container border-bottom mb-4" key={i}>
                        <a href={result.link} className="rest-link">
                            <Button className="rest-button">
                                <i className="fa fa-external-link-square fa-lg fa-fw"></i>
                            </Button>
                        </a>
                        { props.queryType === "Semantic" && 
                            <Button className="rest-like rest-button" 
                                    onClick={() => {
                                        AddGoodMatch(props.query, result.name, result.address)
                                    }}>
                                <i className="fa fa-heart fa-lg fa-fw" id={`like-rest-${i}`}></i>
                                <UncontrolledPopover trigger="hover click" placement="bottom" target={`like-rest-${i}`}>
                                    <PopoverBody>
                                        Give a like if think this is a good recommendation!
                                    </PopoverBody>
                                </UncontrolledPopover>
                            </Button>
                        }
                        <h2 className="w-100">
                            <div className="row">
                                <div className="rest-title col-7 col-md-5">
                                    <b>{result.name}</b>
                                </div>
                                <div className="rest-info col-3">
                                    <small>Rating: {result.rating.toFixed(2)} / 5</small>
                                </div>
                            </div>
                        </h2>
                        <div className="w-100 mb-2">
                            <h4 className="mb-0"><b className="rest-info">Address:</b></h4>
                            <span>{result.address}</span>
                        </div>
                        <div className="rest-info w-100 mb-0">
                            <div className="row">
                                <div className="col-2">
                                    <h4><b>Summary:</b></h4>
                                </div>
                                <div className="col-1">
                                    <i className="fa fa-question-circle fa-lg pl-1 pr-1 mt-2 summary-info" id={`summary-info-${i}`}></i>
                                    <UncontrolledPopover trigger="hover click" placement="bottom" target={`summary-info-${i}`}>
                                        <PopoverBody>
                                            Most semantically 'central' sentences in all reviews (that I have) of <b>{result.name}</b>
                                        </PopoverBody>
                                    </UncontrolledPopover>
                            </div>
                            </div>
                        </div>
                        <p className="rest-summary">
                            {result.summary}
                        </p>
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