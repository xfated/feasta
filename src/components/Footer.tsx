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
                        <p className="quote mb-0">
                            <i className="quote-icon fa fa-broom fa-pull-left"></i>
                            This is my quote
                        </p>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}

export default Footer;