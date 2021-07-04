import React, { useState, useEffect } from 'react';
import { Row, Button, Label, Form, FormGroup, Input, FormFeedback, FormText } from 'reactstrap';
import './QueryForm.css';
import { Query } from './FoodFinder';

interface PropsFunction {
    handleQuery: (values: Query) => void
}

const QueryForm = ({ handleQuery }: PropsFunction) => {
    const [query, setQuery] = useState({
        postal: "",
        topk: 0,
        querytype: "Random",
        query: ""
    })

    // To give help for postal
    const [postalValid, setPostalValid] = useState(true)
    const validatePostal = (postal: string) => {
        setTimeout( () => {}, 1000)
        if (postal.length === 0) {
            setPostalValid(true);
            return
        }
        const postalRe = /^\d{3}$/;
        const validate = postalRe.test(postal);
        setPostalValid(validate);
    }

    // To enable submit button
    const [validSubmit, setValidSubmit] = useState(true)
    const validateSubmit = () => {
        if (!postalValid) {
            setValidSubmit(false);
            return
        }
        setValidSubmit(true);
    }
    useEffect(() => {
        validateSubmit()
    });

    const submitQuery = (e: React.FormEvent) => {
        e.preventDefault()
        handleQuery(query)
    }

    return(
        <>
            <div className="container">
                <Form onSubmit = {(e) => submitQuery(e)}>
                    <Row>
                        <FormGroup className="col-12 col-md-4 mt-2 mt-md-0">
                            <Label htmlFor="postal">&nbsp;Postal Code</Label>
                            <Input type="text" id="postal" name="postal" value={query.postal}
                                placeholder="Postal Code"
                                invalid={!postalValid}
                                onChange={(e) => {
                                    validatePostal(e.target.value);
                                    setQuery({...query,
                                        postal:e.target.value});
                                }}/>
                            <FormFeedback>Invalid postal code. Please input 3 digits or simply leave the field empty</FormFeedback>
                            <FormText>First 3 digits of postal code area you wish to search</FormText>
                        </FormGroup>
                        <FormGroup className="col-12 col-md-4 mt-2 mt-md-0">
                            <Label htmlFor="topk">&nbsp;Number of Results</Label>
                            <Input type="number" id="topk" name="topk" min="0" value={query.topk}
                                placeholder="Number of results to retrieve"
                                onChange={(e) => setQuery({...query,
                                                        topk:parseInt(e.target.value)}
                                )}/>
                            <FormText>Number of restaurants to return</FormText>
                        </FormGroup>
                        <FormGroup className="col-12 col-md-4 mt-2 mt-md-0">
                            <Label htmlFor="querytype">&nbsp;Query Type</Label>
                            <Input type="select" id="querytype" name="querytype" value={query.querytype}
                                placeholder="Random or Semantic search"
                                onChange={(e) => setQuery({
                                                    ...query,
                                                    querytype:e.target.value}
                                                )}>
                                <option>Random</option>
                                <option>Semantic</option>
                            </Input>
                            <FormText>{`Semantic: Search restaurants that are similar to your query | Random: Returns restaurants randomly`}</FormText> 
                        </FormGroup>
                    </Row>
                    <Row className="mt-2">
                        <FormGroup>
                            <Label htmlFor="query">&nbsp;Query</Label>
                            <Input type="textarea" id="query" name="query" value={query.query}
                                placeholder="Your query here"
                                onChange={(e) => setQuery({
                                                    ...query,
                                                    query:e.target.value}
                                                )}/>
                        </FormGroup>
                    </Row>
                    <Row className="mt-3 flex flex-horizontal-center">
                        <Button outline type="submit" value="submit" color="secondary" 
                                disabled={!validSubmit} className="mt-3 col-3">
                            Submit
                        </Button>
                        </Row>
                </Form>
            </div>
        </>
    )
}

export default QueryForm;