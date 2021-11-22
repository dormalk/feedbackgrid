import React from 'react';
import './LoadingSplash.css'
const iconPath = process.env.PUBLIC_URL + '/assets/icons/';

const LoadingSplash = () => {
    return (
        <div className="loading-splash">
            <div className="loading-splash__spinner">
                <img    src={`${iconPath}grid.png`} 
                        alt="" 
                        className="loading-splash__icon"/>
                <h2>FEEDBACK</h2>
                <h3>GRID</h3>
            </div>
        </div>
    );
}

export default LoadingSplash;