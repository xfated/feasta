import React, { useEffect, useState } from 'react';
import { Row, Button, Form, FormGroup, Input, FormFeedback} from 'reactstrap';
import { AddReview, DeleteReview } from './firestore_utils';
import './Reviews.css'
import { QuerySnapshot } from '@firebase/firestore-types';
import { db } from '../index';
import { CSSTransition } from 'react-transition-group';
import firebase from 'firebase';
import { format } from "date-fns";
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

interface CommentsProps {
    restaurant_name: string,
    address: string
}

export interface ReviewInterface {
    review: string,
    created: string,
    rating: number,
    title: string
}

const Reviews = (props: CommentsProps) => {

    // Comment details
    const [title, setTitle] = useState('');
    const [titleValid, setTitleValid] = useState(true);
    const validateTitle = (title: string) => {
        if (title.length > 0) {
            setTitleValid(true);
            return true;
        }
        setTitleValid(false);
        return false;
    }

    const [rating, setRating] = useState('Rating');
    const [ratingValid, setRatingValid] = useState(true);
    const validateRating = (rating: string) => {
        if (rating !== 'Rating') {
            setRatingValid(true);
            return true;
        }
        setRatingValid(false);
        return false;
    }

    const [review, setReview] = useState('');
    const [reviewValid, setReviewValid] = useState(true);
    const validateReview = (review: string) => {
        if (review.trim().split(' ').length >= 5) {
            setReviewValid(true);
            return true;
        }
        setReviewValid(false);
        return false;
    }

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        if (!validateTitle(title)){
            return;
        }
        if (!validateReview(review)){
            return;
        }
        if (!validateRating(rating)){
            return;
        }
        if (user){
            const uid = user.uid;
            AddReview(
                props.restaurant_name,
                props.address,
                review,
                parseInt(rating),
                title,
                uid
            );
            setReview('');
            setRating('Rating');
            setTitle('');
            setReviewEnabled(false);
            alert("Your review has been submitted!");
        }    
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
                                    if (snap.data().created !== null) {
                                        setUserReview({
                                            review: snap.data().review,
                                            created: snap.data().created.toDate(),
                                            rating: snap.data().rating,
                                            title: snap.data().title
                                        })
                                    }
                                }
                                else {
                                    reviews.push({
                                        review: snap.data().review,
                                        created: snap.data().created.toDate(),
                                        rating: snap.data().rating,
                                        title: snap.data().title
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

    const singleReview = (data: ReviewInterface, own_review: boolean) => {
        var date = new Date(data.created);
        var formattedDate = format(date, "do MMMM yyyy");
        if (data !== undefined && data !== null) {
            return (
                <div key={data.created} className={`review ${own_review ? 'own-review' : ''}`}>
                    <div className="row mb-2 pl-0 pr-0 ml-0 mr-0">
                        <div className="col-4 d-flex justify-content-start">
                            <h5 className="review-name">{data.title}</h5>
                        </div>
                        <div className="col-5 d-flex justify-content-start">
                            <h6>
                                <i>
                                    Rating: {`${data.rating}/5 `}
                                </i>
                            </h6>
                        </div>
                        <div className="col-3 d-flex justify-content-end">
                            <h6>
                                <i>{formattedDate}</i>
                            </h6>
                        </div>
                    </div>
                    <div className="ml-4">
                        <p>
                            {data.review}
                        </p>
                    </div>
                    { own_review && 
                        <Button outline color="secondary" className="delete-button pl-2 pr-2"
                            onClick={() => {
                                const user = firebase.auth().currentUser;
                                if (user) {
                                    const confirmDelete = window.confirm('Are you sure you want to delete your review?\nThis process is irreversible.')
                                    if (confirmDelete) {
                                        DeleteReview(props.restaurant_name, props.address,user.uid);
                                        setUserReview(undefined);
                                    }
                                }
                            }}>
                            <i className="fa fa-trash fa-lg"></i>
                        </Button>
                    }
                </div>
            )
        }
        else {
            return ( <div></div> )
        }
    }
    const reviewData = displayReviews?.map((data, idx) => {
        return (    
            singleReview(data, false)
        )
    })
    return (
        <>
            <div className="review-info w-100 mb-0">
                { ((displayReviews && displayReviews.length > 0) || (userReview !== undefined)) &&
                    <div>
                        <div className="row width-100">
                            <div className="col-2">
                                <h3><b>Reviews:</b></h3>
                            </div>
                        </div>
                        <div className="review-box">
                            <OverlayScrollbarsComponent
                                    options={{
                                        resize: 'none',
                                        paddingAbsolute: true,
                                        scrollbars: {
                                            autoHide: 'never',
                                        }
                                    }}
                                    style={{ maxHeight: '300px' }}
                                    >
                                <div>
                                    { reviewData }
                                </div>
                            </OverlayScrollbarsComponent>
                        </div>
                    </div>
                }
            </div> 
            { userReview === undefined ? 
                <div className="w-100 flex flex-horizontal-center">
                    <Button outline color="warning" className="mb-2 review-button" onClick={() => toggleReviewEnabled()}>
                        Add Review
                    </Button>
                </div>
                :
                <div>
                    <div className="row">
                        <div className="review-info col-4 mt-2">
                            <h3><b>Your review:</b></h3>
                        </div>
                    </div>
                    <div className="review-box">
                        {singleReview(userReview, true)}
                    </div>
                </div>
            }
            <CSSTransition
                    timeout={500}
                    in={reviewEnabled}
                    classNames="add-review-form"
                    unmountOnExit
                    >
                <Form onSubmit = {(e: React.FormEvent) => submitComment(e)}>
                    <Row>
                        <FormGroup className="col-9">
                            <Input type="text" id="title" name="title" value={title}
                                placeholder="Title"
                                invalid={!titleValid}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        validateTitle(e.currentTarget.value)
                                        setTitle(e.currentTarget.value)}
                                    }/>
                            <FormFeedback>A title can't be empty</FormFeedback>
                        </FormGroup>
                        <FormGroup className="col-3">
                            <Input type="select" id="region" name="region" value={rating}
                                placeholder="Rating"
                                invalid={!ratingValid}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => setRating(e.currentTarget.value)}>
                                <option>Rating</option>    
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                            <FormFeedback>Give a rating!</FormFeedback>
                        </FormGroup>
                        <FormGroup className="col-12">
                            <Input type="text" id="review" name="review"value={review}
                                placeholder="Review"
                                invalid={!reviewValid}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                        validateReview(e.currentTarget.value)
                                        setReview(e.currentTarget.value)}
                                    }/>
                            <FormFeedback>A good review should not be too short! (More than 5 words)</FormFeedback>
                        </FormGroup>
                        <FormGroup className="col-2 offset-5">
                            <Button outline type="submit" value="submit" color="secondary"
                                className="col-12">
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