import React, {useState} from 'react';
import './FeedbackForm.css';
import { Query } from './FoodFinder';
import { AddFeedback } from './firestore_utils';
import { Row, Button, Label, Form, FormGroup, Input } from 'reactstrap';

    
const FeedbackForm = () => {

    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const submitFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(process.env.REACT_APP_apiKey);
        AddFeedback(feedback, feedbackType);
    }

    return (
        <>
            <div className="section-header col-12 text-center pb-3">
                <div className="col-12 flex flex-horizontal-center mb-3">
                    <h1 className="mb-0 col-5 col-sm-3 header-underline">Feedback</h1>
                </div>
                <p>Appreciate any form of input!</p>
            </div>
            <div className="container mb-5">
                <Form onSubmit = {(e: React.FormEvent) => submitFeedback(e)}>
                    <Row>
                        <FormGroup className="col-12  mt-2 mt-md-0">
                            <Label htmlFor="feedbacktype">&nbsp;Type</Label>
                            <Input type="select" id="feedbacktype" name="feedbacktype" value={feedbackType}
                                placeholder="Random or Semantic search"
                                onChange={(e: React.FormEvent<HTMLInputElement>) => setFeedbackType(e.currentTarget.value)}>
                                <option>General Feedback</option>
                                <option>Suggestion</option>
                                <option>Problem</option>
                                <option>Others</option>
                            </Input>
                        </FormGroup>
                    </Row>
                    <Row className="mt-2">
                        <FormGroup className="col-12">
                            <Label htmlFor="feedback">&nbsp;Feedback</Label>
                            <Input type="textarea" id="feedback" name="feedback" value={feedback}
                                placeholder="Enter your feedback here" rows={4}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => setFeedback(e.currentTarget.value)}/>
                        </FormGroup>
                    </Row>
                    <Row className="mt-3 flex flex-horizontal-center">
                        <Button outline type="submit" value="submit" color="secondary" 
                                className="mt-3 col-3">
                            Submit
                        </Button>
                    </Row>
                </Form>
            </div>
        </>
    )
}

export default FeedbackForm;