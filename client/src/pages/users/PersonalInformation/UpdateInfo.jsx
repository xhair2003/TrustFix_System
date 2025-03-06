import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './UpdateInfo.scss';
import { FaCheck } from "react-icons/fa";
import { height } from '@fortawesome/free-solid-svg-icons/fa0';


const UpdateInfo = ({ initialData, onSave }) => {
  const navigate = useNavigate(); // Hook điều hướng

  const [personalInfo, setPersonalInfo] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email ,
    phone: initialData.phone || '',
    address: initialData.address || '',
    description: initialData.description || '',
    imgAvt: initialData.imgAvt || '',
    balance: initialData.balance || '',
    status: initialData.status,
  });
  const [phoneError, setPhoneError] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value)) {
          setPhoneError('Số điện thoại không hợp lệ (10-11 số)');
          setPhoneValid(false);
        } else {
          setPhoneError('');
          setPhoneValid(true);
        }
      }
    setPersonalInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPersonalInfo(prevState => ({
        ...prevState,
        imgAvt: imageUrl
      }));
    }
  };

  const handleSave = () => {
    if (phoneError) {
      alert('Vui lòng nhập số điện thoại hợp lệ trước khi lưu!');
      return;
    }

    if (onSave) {
      onSave(personalInfo);
    }
  };


  const handleDeposit = () => {
    navigate('/wallet');
  };

  const handleRegisterWorker = () => {
    navigate('/upgrade-repair-man'); 
  };

  return (
    <div className="update-info-container">
      <div className="update-info-form">
        <div className="info-item avatar-section">
          <label className="label">Ảnh Đại Diện</label>
          <div className="avatar-preview">
            {personalInfo.imgAvt && (
              <img src={personalInfo.imgAvt} alt="Avatar" className="avatar-image" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload"
            />
          </div>
        </div>

        <div className="info-item">
          <label className="label">Họ</label>
          <input
            type="text"
            name="firstName"
            value={personalInfo.firstName}
            onChange={handleChange}
            className="input-field"
            placeholder="Nhập họ"
          />
        </div>
        <div className="info-item">
          <label className="label">Tên</label>
          <input
            type="text"
            name="lastName"
            value={personalInfo.lastName}
            onChange={handleChange}
            className="input-field"
            placeholder="Nhập tên"
          />
        </div>
        <div className="info-item">
          <label className="label">Địa chỉ Email (*)</label>
          <input
            readOnly
            type="email"
            name="email"
            value={personalInfo.email}
            className="input-field"
          />
        </div>
        <div className="info-item">
          <label className="label">Số dư</label>
          <input
            readOnly
            type="text"
            name="balance"
            value={personalInfo.balance}
            className="input-field"
          />
          <button className="deposit_bt" onClick={handleDeposit}>Nạp tiền</button>
        </div>
        <div className="info-item">
          <label className="label">Vai trò</label>
          <input
            readOnly
            type="int"
            name="status"
            value={personalInfo.status === 1 ? 'Khách hàng' : 'Thợ'}
            className="input-field"
          />
          {personalInfo.status === 1 && (
            <button className="deposit_bt" onClick={handleRegisterWorker}>
              Đăng ký làm thợ
            </button>
          )}
        </div>
        <div className="info-item">
          <label className="label">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={personalInfo.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="Nhập số điện thoại"
            style={{ maxWidth: '193px' }} 
          />
          {phoneValid ? (
              <span className="valid-icon"><FaCheck /></span>
            ) : phoneError ? (
                <p className="error-text">{phoneError}</p>
            ) : null}
        </div>
        <div className="info-item">
          <label className="label">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={personalInfo.address}
            onChange={handleChange}
            className="input-field"
            placeholder="Nhập địa chỉ"
          />
        </div>
        <div className="info-item">
          <label className="label">Mô tả</label>
          <textarea
            name="description"
            value={personalInfo.description}
            onChange={handleChange}
            className="textarea-field" 
            placeholder="Nhập mô tả"
          />
        </div>

        <div className="button-group">
          <button className="save-button" onClick={handleSave}>Lưu Thay Đổi</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInfo;
