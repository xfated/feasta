import React from 'react';
import { Container, Jumbotron } from 'reactstrap';
import { CSSTransition } from "react-transition-group";
import './Header.css';

const Header = () => {
    return(
        <>
            <Jumbotron style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/images/header_bg.jpg')`, 
                                backgroundSize: 'cover',
                                borderRadius: "0px"}}>
                <Container className="text-center title-container">
                    <h1 className="display-2 main-title pt-2 mb-0">Feasta</h1>
                    <h3 className="mb-0">fē-ˈe-stə</h3>
                    <small>Pronounced: 'Fiesta'</small>
                    <p className="pt-3"><b><i>By the indecisive, for the indecisive.</i></b></p>
                </Container>
            </Jumbotron>
        </>
    )
}

export default Header;