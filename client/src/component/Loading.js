import React from 'react';
import logo from '../assets/Images/onlyLogo.jpg';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm">
            {/* fixed */}
            <div className="relative flex items-center justify-center">
                {/* Outer Glow Effect */}
                <div className="absolute w-24 h-24 rounded-full bg-blue-500 opacity-50 blur-xl animate-pulse shadow-[0_0_20px_rgba(0,112,255,0.5)]"></div>

                {/* Spinner with Border and Shadow */}
                <div className="w-20 h-20 border-2 border-blue-500 border-t-transparent border-dashed rounded-full animate-spin shadow-[0_0_15px_rgba(0,112,255,0.4)]"></div>

                {/* Logo with Border and Soft Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-[0_0_10px_rgba(0,112,255,0.5)] animate-pulse"
                    />
                </div>
            </div>
        </div>
    );
};

export default Loading;

