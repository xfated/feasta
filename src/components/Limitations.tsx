import React, {useState, useEffect} from 'react';
import './Limitations.css';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { CSSTransition } from 'react-transition-group';

const Limitations = () => {
    const [showInfo, setShowInfo] = useState(false);

    const isInViewPort = (e: Element) => {
        const rect = e.getBoundingClientRect();
        // if within desired range
        if (rect.top >= (window.innerHeight || document.documentElement.clientHeight)*(1/10) &&
            rect.left >= 0 &&
            rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight)*(6/7))&&
            rect.right <= ((window.innerWidth || document.documentElement.clientWidth))
            ){
            setShowInfo(true);
        }
        else {
            setShowInfo(false);
        }
    }
    
    useEffect(() => {
        const checkLimitationScroll = () => {
            const limitationInfo = document.querySelector('.wrapper');
            if (limitationInfo !== null) {
                isInViewPort(limitationInfo);
            }
        }
        
        window.addEventListener('scroll', checkLimitationScroll, { passive: true})
        return () => window.removeEventListener("scroll", checkLimitationScroll)
    }, [])

    return (
        <div className="w-100 flex flex-horizontal-center pb-5">
            <div className="wrapper" >
                <div className={`disclaimer flex flex-horizontal-center` + `${showInfo ? ' disclaimer-bg' : ''}`}>
                    <img src={"/assets/images/disclaimer.jpg"} className="disclaimer-img">
                    </img>
                    <div className="disclaimer-text-box">
                        <h4 className="display-4">Setting Expectations</h4>
                    </div>
                </div>
                <CSSTransition
                    timeout={500}
                    in={showInfo}
                    classNames="show-info"
                    unmountOnExit
                    >
                    <div className="info">
                        <div className="col-12 text-center pt-5">
                            <p id="time-info" className="disclaimer-info">Semantic search only available from 9am to 9pm.</p>
                            <UncontrolledPopover trigger="hover click" placement="top" target="time-info">
                                <PopoverBody>
                                    Because hosting is expensive.
                                </PopoverBody>
                            </UncontrolledPopover>
                        </div>
                        <div className="col-12 text-center">
                            <p id="semantic-info" className="disclaimer-info">Searching outside specific region/postal will give the best results for semantic matching!</p>
                            <UncontrolledPopover trigger="hover click" placement="top" target="semantic-info">
                                <PopoverBody>
                                    Might not have data on relevant restaurants in particular areas. As such, even the closest matches might not be the <i><b>best</b></i><br />
                                    Limited by data availability :(
                                </PopoverBody>
                            </UncontrolledPopover>
                        </div>
                        <div className="col-12 text-center">
                            <p className="disclaimer-info">Some postal/regions have poor results as I do not have data on eateries there</p>
                        </div>
                        <div className="col-12 text-center">
                            <p className="disclaimer-info">More descriptive queries should work better</p>
                        </div>
                    </div> 
                </CSSTransition>
            </div>
        </div>
    )   
}

export default Limitations;