import React from 'react';
import './Footer.css'

// To add props if necessary
const Footer = () => {
    return(
        <div className="footer">
           <div className="divider"></div>
           <div className="footer-content flex flex-vertical-center flex-horizontal-center"> 
                <div className="row">
                    <div className="col-12 flex flex-horizontal-center">
                        <blockquote className="blockquote text-center flex">
                            <i className="quote-icon fa fa-quote-left fa-pull-left"></i>
                            <p className="quote mb-0 ml-1 mr-1">
                                A balanced diet is a cookie in each hand.
                            </p>
                            <i className="quote-icon fa fa-quote-right fa-pull-right"></i>
                        </blockquote>
                    </div>
                    <div className="col-12 flex flex-horizontal-center">
                        <p className="contact">
                            Feedback / Queries / Suggestions: <span className="email">taykaiyang556@gmail.com</span>
                        </p>    
                    </div>
                    <div className="col-12 flex flex-horizontal-center">
                        <p className="disclaimer mt-0">
                            A few words:<br/>
                            It has been a fun project but I'm not sure if I will continue developing on this idea or just leave it as it is.<br/>
                            Would like to hear any feedback if this has actually been useful for anyone else as it has been for me!
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Footer;