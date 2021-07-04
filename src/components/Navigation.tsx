import { useState, useEffect } from 'react';
import { Navbar, Nav, NavItem, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import './Navigation.css'

const Navigation = () => {

    const [infoModalOpen, setInfoModalOpen] = useState(false);
    
    const toggleInfoModal = () => {
        setInfoModalOpen(!infoModalOpen);
    }

    return (
        <div>
            <Navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Button onClick={toggleInfoModal} className="ml-1 mr-1">
                            <i className="fas fa-question-circle fa-lg fa-fw"></i>
                        </Button>
                    </NavItem>    
                </Nav>
            </Navbar>   
            <Modal isOpen={infoModalOpen} toggle={toggleInfoModal} className="modal-w80">
                <ModalHeader toggle={toggleInfoModal} charCode="x">
                    What is Feasta?
                </ModalHeader>
                <ModalBody>

                </ModalBody>
            </Modal>
        </div>
    );
}

export default Navigation;
