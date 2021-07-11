import React, {useState, useEffect} from 'react';
import './Limitations.css';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';

const Limitations = () => {
    const [showInfo, setShowInfo] = useState(false);

    const isInViewPort = (e: Element) => {
        const rect = e.getBoundingClientRect();
        // if within desired range
        if (rect.top >= (window.innerHeight || document.documentElement.clientHeight)*(1/6) &&
            rect.left >= 0 &&
            rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight)*(5/6))&&
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
        <div className="w-100 flex flex-horizontal-center">
            <div className="wrapper" >
                <div className={`disclaimer flex flex-horizontal-center` + `${showInfo ? ' disclaimer-bg' : ''}`}>
                    <img src={"/assets/images/disclaimer.jpg"} className="disclaimer-img">
                    </img>
                    <div className="disclaimer-text-box">
                        <h4 className="display-4">Setting Expectations</h4>
                    </div>
                </div>
                {   showInfo &&
                    <div className="info flex flex-horizontal-center">
                         <p id="time-info"><small>P.S. Semantic search only available from 9am to 9pm.</small></p>
                        <UncontrolledPopover trigger="hover click" placement="bottom" target="time-info">
                            <PopoverBody>
                                Because hosting is expensive.
                            </PopoverBody>
                        </UncontrolledPopover>
                    </div>
                }
            </div>
        </div>
    )   
}

export default Limitations;