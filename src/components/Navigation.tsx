import { useState, useEffect } from 'react';
import { Navbar, Nav, NavItem, Button, Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem } from 'reactstrap';
import './Navigation.css';
import SignInScreen from './SignInScreen';

const Navigation = () => {

    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    
    const toggleInfoModal = () => {
        setInfoModalOpen(!infoModalOpen);
    }

    const navbarControl = () => {
        if (window.scrollY > 100) {
            setNavHidden(true);
        }
        else {
            setNavHidden(false);
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', navbarControl);
        return () => window.removeEventListener('scroll', navbarControl);
    }, [])

    return (
        <div className="w-100">
            <Navbar className={`navbar-overlap ${navHidden && 'nav-hidden'}`}>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Button onClick={toggleInfoModal} className="button">
                            <i className="fa fa-question-circle fa-lg fa-fw"></i>
                        </Button>
                    </NavItem>      
                    <NavItem>
                        <SignInScreen />
                    </NavItem>    
                    {/* <NavItem>
                        <Button onClick={toggleInfoModal} className="button">
                            <i className="fa fa-question-circle fa-lg fa-fw"></i>
                        </Button>
                    </NavItem>       */}
                </Nav>
            </Navbar>  
            <Modal isOpen={infoModalOpen} toggle={toggleInfoModal} className="info-modal modal-w80"
                centered={true}>
                <ModalHeader toggle={toggleInfoModal}>
                    Information
                </ModalHeader>
                <ModalBody>
                    <ListGroup flush>
                        <ListGroupItem key={1} className="mt-2 mb-2">
                            <div className="row flex flex-vertical-center">
                                <div className="col-12 col-md-3 text-center">
                                    <h4>Origins</h4>
                                </div>
                                <div className="col-12 col-md-9 text-center">
                                    <p>To be blunt, this was inspired by my abundance of indecisiveness when it comes to food. </p>
                                    <p>More than once, my friends and I have wandered aimlessly simply because we could not decide on what to eat. 
                                       And in the rare cases I knew what I wanted, it felt like a chore to sieve through multiple review sites to find nice suggestions.
                                    </p>
                                </div>      
                            </div>
                        </ListGroupItem>
                        <ListGroupItem key={2} className="mt-2 mb-2">
                            <div className="row flex flex-vertical-center">
                                <div className="col-12 col-md-3 order-md-2 text-center">
                                    <h4>Purpose</h4>
                                </div>
                                <div className="col-12 col-md-9 text-center">
                                    <p>I want suggestions.</p>
                                    <p>I want suggestions catered to my immediate interests.</p>
                                    <p>I knew what I wanted. So I made this website.</p>
                                    <p>Hopefully it helps you too.</p>
                                    <p>
                                        <small>P.S. The goal here is to simply serve as a starting point to search for places you'd like to eat at!</small>
                                    </p>
                                </div>      
                            </div>
                        </ListGroupItem>
                        <ListGroupItem key={3} className="mt-2 mb-2">
                            <div className="row flex flex-vertical-center">
                                <div className="col-12 col-md-3 text-center">
                                    <h4>Behind the scenes</h4>
                                </div>
                                <div className="col-12 col-md-9 text-center">
                                    <p>A deep learning model trained on restaurant reviews.</p>
                                    <p>Thought process: Reviews should include mentions of what people enjoyed at a restaurant.
                                        If others' enjoyed it, I would probably enjoy it too.
                                    </p>
                                </div>      
                            </div>
                        </ListGroupItem>
                    </ListGroup>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default Navigation;
