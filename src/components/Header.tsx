import React from 'react';
import { Container, Jumbotron } from 'reactstrap';
import { CSSTransition } from "react-transition-group";
import './Header.css';

const Header = () => {
    return(
        <>
            <Jumbotron style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/images/header_bg.jpg')`, backgroundSize: 'cover', 
                                borderRadius: "0px"}}>
                <Container className="text-center title-container">
                    <h1 className="display-2">Feasta</h1>
                    <h3>fē-ˈe-stə</h3>
                    <small>Pronounced: 'Fiesta'</small>
                    <p>I will help you find your food.</p>
                </Container>
            </Jumbotron>
        </>
    )
}

export default Header;