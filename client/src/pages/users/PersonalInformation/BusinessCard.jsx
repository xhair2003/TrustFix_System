import React from 'react';
import './BusinessCard.scss';

const BusinessCard = ({ 
  username, 
  balance, 
  email, 
  phone, 
  status, 
  avatar,
  address,
  description,

}) => {
  return (
    <div className="business-card">
      <div className="card-header">
        <img src={avatar} alt="Avatar" className="avatar" />
        <div className="name-section">
          <h2>{username}</h2>
          <p>{balance}</p>
        </div>
      </div>
      <div className="card-body">
        <div className="contact-info">
          <div className="info-item">
            <span className="icon email">✉️</span>
            <span>{email}</span>
          </div>
          {phone && (
            <div className="info-item">
              <span className="icon phone">📞</span>
              <span>{phone}</span>
            </div>
          )}
          <div className="info-item">
            <span className="icon role">{status === 'Khách hàng' ? "🙋" : "🧑‍🔧"}</span>
            <span>{status}</span>
          </div>
          <div className="info-item">
            <span className="icon verified">📍</span>
            <span>{address}</span>
          </div>
          <div className="info-item">
            <span className="icon verified">ℹ️</span>
            <span>{description}</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;