import React, { useEffect, useState } from 'react';
import { Row, Button, Label, Form, FormGroup, Input, FormFeedback, FormText,
    UncontrolledPopover, PopoverBody } from 'reactstrap';
import { AddComment} from './firestore_utils';
import './Reviews.css'
import { QuerySnapshot } from '@firebase/firestore-types';
import { db } from '../index';

interface CommentsProps {
    restaurant_name: string,
    address: string
}

export interface ReviewInterface {
    review: string,
    created: string,
    rating: number
}

const Reviews = (props: CommentsProps) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(5);
    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        AddComment(
            props.restaurant_name,
            props.address,
            review,
            rating,
        );
        setReview('');
        console.log('printing reviews');
        console.log(displayReviews);
    }

    const [displayReviews, setDisplayReviews] = useState<Array<ReviewInterface>>();
    useEffect(() => {
        const GetReviews = ( restaurant_name: string,
                                    address: string,
                                    ) => {
            // Get address
            restaurant_name = restaurant_name.replace(/[^a-zA-Z0-9 \n\.]/g, '').toLowerCase().replaceAll(' ','_'); 
            let postal_code = address.match(/Singapore [0-9]{6,6}/);
            let unit = address.match(/#[0-9\-]+/);
            if (postal_code === null || unit === null){
                return;
            } 
            let postal = postal_code[0].split(" ")[1];
            let unit_number = unit[0];
            let restaurant_key: string = `${restaurant_name}_${postal}_${unit_number}`;

            const restRef = db.collection('restaurants').doc(restaurant_key);
            restRef.collection('comments').orderBy("created","desc")
                .onSnapshot((querySnapshot: QuerySnapshot) => {
                    if (!querySnapshot.empty) {
                        let reviews: ReviewInterface[] = [];
                        querySnapshot.forEach((snap) => {
                            reviews.push({
                                review: snap.data().review,
                                created: snap.data().created,
                                rating: snap.data().rating
                                })  
                            })
                        console.log(reviews);
                        setDisplayReviews(reviews);
                        return;
                    }
                    return;
                },
                error => {
                    console.log(error);
                    return;
                    })
                };
        
        GetReviews(props.restaurant_name, props.address )
    }, [])

    return (
        <>
            <div className="review-info w-100 mb-0">
                <div className="row">
                    <div className="col-2">
                        <h4><b>Reviews:</b></h4>
                    </div>
                </div>
            </div> 
            <Form onSubmit = {(e: React.FormEvent) => submitComment(e)}>
                <Row  >
                    <FormGroup className="col-8">
                        <Input type="text" id="review" name="review"value={review}
                            placeholder="Review"
                            onChange={(e: React.FormEvent<HTMLInputElement>) => setReview(e.currentTarget.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="select" id="region" name="region" value={rating}
                            placeholder="Rating"
                            onChange={(e: React.FormEvent<HTMLInputElement>) => setRating(parseInt(e.currentTarget.value))}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="col-3">
                        <Button outline type="submit" value="submit" color="secondary"
                            className="col-12">
                            Submit
                        </Button>
                    </FormGroup>
                </Row>
            </Form>
        </>
    )
}

export default Reviews;