import React from 'react';
import { Button } from 'reactstrap';
import './RestaurantInfo.css';
import { QueryResult } from './FoodFinder';

interface RestaurantInfoProps {
    results: Array<QueryResult> | null
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = (props) => {
    const RestInfo = props.results != null ? props.results.map((result, i) => {
            // console.log(result.summary);
            return (
                <div className="row rest-container border-bottom mb-4" key={i}>
                    <a href={result.link} className="rest-link">
                        <Button className="rest-button">
                            <i className="fa fa-external-link-square fa-lg fa-fw"></i>
                        </Button>
                    </a>
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
                    <h4 className="rest-info w-100 mb-0">
                        <b>Summary:</b>
                    </h4>
                    <p className="rest-summary">
                        {result.summary}
                    </p>
                    
                </div>
            )
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