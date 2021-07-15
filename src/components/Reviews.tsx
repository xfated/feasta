import React, { useEffect, useState } from 'react';
import { Row, Button, Form, FormGroup, Input, FormFeedback} from 'reactstrap';
import { AddReview } from './firestore_utils';
import './Reviews.css'
import { QuerySnapshot } from '@firebase/firestore-types';
import { db } from '../index';
import { CSSTransition } from 'react-transition-group';
import firebase from 'firebase';
import { format } from "date-fns";

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
    const [rating, setRating] = useState('Rating');
    const [reviewValid, setReviewValid] = useState(true);
    const validateReview = (review: string) => {
        if (review.trim().split(' ').length >= 5 || review.length === 0) {
            setReviewValid(true);
            return
        }
        setReviewValid(false);
    }
    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
//         const answer = window.confirm(`Please check the details of your review!\n
// Review: ${review} \n
// Rating: ${rating} / 5 \n
// Click 'OK' if acceptable. \n
// P.S. you won't be able to delete the comment once it is submitted! Please email me with the time of submission to delete it if necessary.
//         `) 
//         if (answer) {
        const user = firebase.auth().currentUser;
        if (user){
            const uid = user.uid;
            AddReview(
                props.restaurant_name,
                props.address,
                review,
                parseInt(rating),
                uid
            );
        }
        setReview('');
        setRating('Rating');
    }

    /* Display Reviews */
    const [displayReviews, setDisplayReviews] = useState<Array<ReviewInterface>>([]);
    const [userReview, setUserReview] = useState<ReviewInterface>();
    useEffect(() => {
        let isMounted = true;
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
            restRef.collection('reviews').orderBy("created","asc")
                .onSnapshot((querySnapshot: QuerySnapshot) => {
                    if (!querySnapshot.empty) {
                        if (isMounted) {
                            let reviews: ReviewInterface[] = [];
                            querySnapshot.forEach((snap) => {
                                // Store user's review separately
                                const user = firebase.auth().currentUser;
                                if (user !== null && snap.data().uid === user.uid){
                                        setUserReview({
                                            review: snap.data().review,
                                            created: snap.data().created.toDate(),
                                            rating: snap.data().rating
                                        })
                                }
                                else {
                                    reviews.push({
                                        review: snap.data().review,
                                        created: snap.data().created.toDate(),
                                        rating: snap.data().rating
                                    })  
                                }
                            })
                            setDisplayReviews(reviews);
                        }
                        return;
                    }
                    return;
                },
                error => {
                    console.log(error);
                    return;
                    })
                };
        
        GetReviews(props.restaurant_name, props.address)
        return () => { isMounted = false };
    }, [props.restaurant_name, props.address])

    const [reviewEnabled, setReviewEnabled] = useState(false);
    const toggleReviewEnabled = () => {
        if (!reviewEnabled && firebase.auth().currentUser === null) {
            alert("Please sign-in at the top to submit a review!")
        }
        else {
            setReviewEnabled(!reviewEnabled)
        }
    };
    const reviewData = displayReviews?.map((data, idx) => {
        var date = new Date(data.created);
        var formattedDate = format(date, "do MMMM yyyy");
        console.log(formattedDate)
        return (
            <div key={data.created} className="review w-100">
                <div className="row">
                    <div className="col-4 d-flex justify-content-start">
                        <h6>some name</h6>
                    </div>
                    <div className="col-4 d-flex justify-content-center">
                        <h6>
                            Rating: {`${data.rating}/5 `}
                        </h6>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                        <h6>
                            {formattedDate}
                        </h6>
                    </div>
                </div>
                <span className="col-4">
                    {data.review}
                </span>
                
                
            </div>
        )
    })
    return (
        <>
            <div className="review-info w-100 mb-0">
                { displayReviews && displayReviews.length > 0 &&  
                    <div>
                        <div className="row">
                            <div className="col-2">
                                <h4><b>Reviews:</b></h4>
                            </div>
                        </div>
                        <div>
                            { reviewData }
                        </div>
                    </div>
                }
            </div> 
            <div className="w-100 flex flex-horizontal-center">
                <Button outline color="warning" className="mb-2 review-button" onClick={() => toggleReviewEnabled()}>
                    Add Review
                </Button>
            </div>
            <CSSTransition
                    timeout={500}
                    in={reviewEnabled}
                    classNames="add-review-form"
                    unmountOnExit
                    >
                <Form onSubmit = {(e: React.FormEvent) => submitComment(e)}>
                    <Row>
                        <FormGroup className="col-7">
                            <Input type="text" id="review" name="review"value={review}
                                placeholder="Review"
                                invalid={!reviewValid}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        validateReview(e.currentTarget.value)
                                        setReview(e.currentTarget.value)}
                                    }/>
                            <FormFeedback>A good review should not be too short! (More than 5 words)</FormFeedback>
                        </FormGroup>
                        <FormGroup className="col-3">
                            <Input type="select" id="region" name="region" value={rating}
                                placeholder="Rating"
                                onChange={(e: React.FormEvent<HTMLInputElement>) => setRating(e.currentTarget.value)}>
                                <option>Rating</option>    
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="col-2">
                            <Button outline type="submit" value="submit" color="secondary"
                                disabled={review.length === 0 || rating === 'Rating'} className="col-12">
                                Submit
                            </Button>
                        </FormGroup>
                    </Row>
                </Form>
            </CSSTransition>
        </>
    )
}

export default Reviews;