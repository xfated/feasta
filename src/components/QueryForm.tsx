import React, { useState, useEffect } from 'react';
import { Row, Button, Label, Form, FormGroup, Input, FormFeedback, FormText,
        InputGroup, InputGroupButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem,
        UncontrolledPopover, PopoverBody } from 'reactstrap';
import './QueryForm.css';
import { Query } from './FoodFinder';

interface PropsFunction {
    handleQuery: (values: Query) => void
}

const QueryForm = ({ handleQuery }: PropsFunction) => {
    const [query, setQuery] = useState({
        postal: "",
        topk: 5,
        querytype: "Text Query",
        query: "",
        region: "",
    })

    // To change between postal and region
    const [postalregion, setPostalregion] = useState('Postal');
    const [postalregionDropdownOpen, setPostalregionDropdownOpen] = useState(false);
    const togglePostalregionDropdow = () => setPostalregionDropdownOpen(!postalregionDropdownOpen);
    
    // To give help for postal
    const [postalValid, setPostalValid] = useState(true)
    const validatePostal = (postal: string) => {
        if (postal.length === 0) {
            setPostalValid(true);
            return
        }
        const postalRe = /^\d{2}$/;
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
        e.preventDefault();
        handleQuery(query);
    }

    return(
        <>
            <div className="container hide-overflow">
                <Form onSubmit = {(e: React.FormEvent) => submitQuery(e)}>
                    <Row>
                        <FormGroup className="col-12 col-md-4 mt-2 mt-md-0">
                            <Label htmlFor="topk">&nbsp;Number of Results</Label>
                            <Input type="number" id="topk" name="topk" min="0" value={query.topk}
                                placeholder="Number of results to retrieve"
                                onChange={(e: React.FormEvent<HTMLInputElement>) => setQuery({...query,
                                                        topk:parseInt(e.currentTarget.value)}
                                )}/>
                            <FormText>Number of restaurants to return</FormText>
                        </FormGroup>
                        <FormGroup className="col-12 col-md-4 mt-2 mt-md-0">
                            <Label htmlFor="querytype">&nbsp;Query Type</Label>
                            <Input type="select" id="querytype" name="querytype" value={query.querytype}
                                onChange={(e: React.FormEvent<HTMLInputElement>) => setQuery({
                                                    ...query,
                                                    querytype:e.currentTarget.value}
                                                )}>
                                <option>Text Query</option>
                                <option>Top Rated</option>
                                <option>Random</option>
                            </Input>
                            {query.querytype === "Random" &&
                                <FormText>Returns restaurants randomly</FormText>
                            }
                            {query.querytype === "Top Rated" &&
                                <FormText>Returns restaurants with highest ratings
                                    <i className="fa fa-question-circle fa-lg pl-1 pr-1" id="rating-info"></i>
                                    <UncontrolledPopover trigger="hover click" placement="bottom" target="rating-info">
                                        <PopoverBody>
                                            Average rating of reviews
                                        </PopoverBody>
                                    </UncontrolledPopover>
                                </FormText>
                            }
                            {query.querytype === "Text Query" &&
                                <FormText>Search restaurants that are similar to your query</FormText>
                            }
                        </FormGroup>
                        <FormGroup className="mt-2 col-12 col-md-4 mt-md-0">
                            <Label htmlFor="postalregion">&nbsp;Postal / Region</Label>
                            <InputGroup>
                                <InputGroupButtonDropdown addonType="prepend" isOpen={postalregionDropdownOpen} toggle={togglePostalregionDropdow}>
                                    <DropdownToggle caret>
                                        {postalregion}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => { setPostalregion('Postal'); setQuery({...query, region:''}); }} >Postal</DropdownItem>
                                        <DropdownItem onClick={() => { setPostalregion('Region'); setQuery({...query, postal:''}); setPostalValid(true); }}>Region</DropdownItem>
                                    </DropdownMenu>
                                </InputGroupButtonDropdown>
                                { (postalregion === 'Postal') ? 
                                    <Input type="text" id="postalregion" name="postalregion" value={query.postal}
                                        placeholder="Postal Code"
                                        invalid={!postalValid}
                                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                            validatePostal(e.currentTarget.value);
                                            setQuery({...query,
                                                postal:e.currentTarget.value});
                                        }}/>
                                    :
                                    <Input type="select" id="region" name="region" value={query.region}
                                        placeholder="Region"
                                        onChange={(e: React.FormEvent<HTMLInputElement>) => setQuery({
                                                            ...query,
                                                            postal:'',
                                                            region:e.currentTarget.value}
                                                        )}>
                                        <option></option>
                                        <option>North-East</option>
                                        <option>North</option>
                                        <option>Central</option>
                                        <option>West</option>
                                        <option>East</option>
                                    </Input>
                                }
                            { (postalregion === 'Postal') && 
                                <FormFeedback>Invalid postal code. Please input 2 digits or simply leave the field empty</FormFeedback>
                            }
                            </InputGroup>
                            { (postalregion === 'Postal') &&     
                                <FormText>First 2 digits of postal code area you wish to search</FormText> }
                            { (postalregion === 'Region') &&     
                                <FormText>Region of Singapore</FormText> }
                        </FormGroup>
                    </Row>
                    { query.querytype === 'Text Query' &&
                        <Row className="mt-2">
                            <FormGroup className="col-12">
                                <Label htmlFor="query">&nbsp;Query</Label>
                                <Input type="textarea" id="query" name="query" value={query.query}
                                    placeholder="Your query here" rows={4}
                                    onChange={(e: React.FormEvent<HTMLInputElement>) => setQuery({
                                                        ...query,
                                                        query:e.currentTarget.value}
                                                    )}/>
                            </FormGroup>
                        </Row>
                    }
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