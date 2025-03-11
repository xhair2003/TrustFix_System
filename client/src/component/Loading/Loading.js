import React from 'react';
import logo from '../../assets/Images/onlyLogo.png';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="spinner-wrapper">
                <div className="outer-glow"></div>
                <div className="spinner"></div>
                <div className="logo-container">
                    <img
                        src={logo}
                        alt="Logo"
                        className="logo"
                    />
                </div>
            </div>
        </div>
    );
};

export default Loading;