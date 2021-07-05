import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import RestaurantFinder from './FoodFinder';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Footer from './Footer';

function Main() {
    return (
        <>
            <Navigation />
            <Header />
            <Switch>
                <Route path="/" component={RestaurantFinder} />
                <Redirect to="/" />
            </Switch>
            <Footer />
        </>
    )
}

export default withRouter(Main);