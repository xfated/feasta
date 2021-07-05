import React from 'react';
import './Footer.css'

// To add props if necessary
const Footer = () => {
    return(
        <div className="footer">
           <div className="divider"></div>
           <div className="footer-content flex flex-vertical-center flex-horizontal-center"> 
                <div>
                    <blockquote className="blockquote text-center flex">
                        <i className="quote-icon fa fa-quote-left fa-pull-left"></i>
                        <p className="quote mb-0">
                            A balanced diet is a cookie in each hand.
                        </p>
                        <i className="quote-icon fa fa-quote-right fa-pull-right"></i>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}

export default Footer;