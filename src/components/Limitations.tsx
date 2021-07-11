import React, {useState, useEffect} from 'react';
import './Limitations.css';

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
                <div className="disclaimer flex flex-horizontal-center">  
                    <img src={"/assets/images/disclaimer.jpg"} className="disclaimer-img">
                    </img>
                    <div className="disclaimer-text-box">
                        <h4 className="display-4">Disclaimer</h4>
                    </div>
                </div>
                {   showInfo &&
                    <div className="info">
                        lo
                    </div>
                }
            </div>
        </div>
    )   
}

export default Limitations;