import React from 'react';
import { Button } from 'reactstrap';
import './RestaurantInfo.css';
import { QueryResult } from './FoodFinder';

interface RestaurantInfoProps {
    results: Array<QueryResult> | null
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = (props) => {
    const RestInfo = props.results != null ? props.results.map((result, i) => {
            console.log(result.summary);
            return (
                <div className="row rest-container">
                    <a href={'https://www.google.com'} className="rest-link">
                        <Button className="rest-button">
                            <i className="fa fa-external-link-square fa-lg fa-fw"></i>
                        </Button>
                    </a>
                    <h5 className="rest-title">{result.name}</h5>
                    <p>
                    
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