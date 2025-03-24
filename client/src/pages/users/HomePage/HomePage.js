import React from 'react';
import './HomePage.css';
import introductionImage from '../../../assets/Images/introduction.jpg';

const HomePage = () => {
    return (
        <div>
            <div className="homepage-container">
                <div className="introduction-section">
                    <img src={introductionImage} alt="Introduction" className="introduction-image" />
                </div>

                <div className="introduction-text">
                    <h2>Cách tốt hơn để tìm thợ sửa chữa của bạn</h2>
                    <p>
                        Cách tốt hơn để tìm thợ sửa chữa của bạn. Cách tốt hơn để tìm thợ sửa chữa của bạn, Cách tốt hơn để tìm thợ sửa chữa của bạn Cách tốt hơn
                    </p>
                </div>

                <div className="content-section">
                    {/* Nội dung khác sẽ được thêm vào đây */}
                </div>
            </div>
        </div>
    );
}

export default HomePage;