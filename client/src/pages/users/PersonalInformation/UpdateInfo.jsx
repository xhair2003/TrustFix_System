import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateInfo.scss';
import { FaCheck } from "react-icons/fa";

const UpdateInfo = ({ initialData, onSave }) => {
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email,
    phone: initialData.phone || '',
    address: initialData.address || '',
    description: initialData.description || '',
    imgAvt: initialData.imgAvt || '',
    balance: initialData.balance || 0,
    type: initialData.type || '',
  });

  const [phoneError, setPhoneError] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [newCertificates, setNewCertificates] = useState([]);

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
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Vui lòng chỉ tải lên ảnh định dạng JPG, PNG hoặc JPEG!');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setPersonalInfo(prevState => ({
        ...prevState,
        imgAvt: file,
        imgAvtPreview: imageUrl
      }));
    }
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxFiles = 4;
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes

    // Kiểm tra số lượng file
    if (files.length + newCertificates.length > maxFiles) {
      alert(`Bạn chỉ có thể tải lên tối đa ${maxFiles} ảnh!`);
      return;
    }

    const newCerts = files.map((file) => {
      // Kiểm tra định dạng file
      if (!validTypes.includes(file.type)) {
        alert('Vui lòng chỉ tải lên ảnh định dạng JPG, PNG hoặc JPEG!');
        return null;
      }

      // Kiểm tra kích thước file
      if (file.size > maxSize) {
        alert(`Kích thước file ${file.name} vượt quá 10MB!`);
        return null;
      }

      return {
        file: file,
        preview: URL.createObjectURL(file),
        description: '',
      };
    }).filter((cert) => cert !== null);

    setNewCertificates((prev) => [...prev, ...newCerts]);
  };

  const handleCertificateDescription = (index, value) => {
    setNewCertificates(prev => {
      const updated = [...prev];
      updated[index].description = value;
      return updated;
    });
  };

  const handleRemoveCertificate = (index) => {
    setNewCertificates(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveCertificates = () => {
    setPersonalInfo(prev => ({
      ...prev,
      certificates: [...(prev.certificates || []), ...newCertificates]
    }));
    setNewCertificates([]);
    setShowCertificateModal(false);
  };

  const handleSave = () => {
    if (phoneError) {
      alert('Vui lòng nhập số điện thoại hợp lệ trước khi lưu!');
      return;
    }

    if (onSave) {
      const updatedInfo = {
        ...personalInfo,
        image: personalInfo.imgAvt
      };
      onSave(updatedInfo);
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
              <img src={personalInfo.imgAvtPreview} alt="Ảnh đại diện" className="avatar-image" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload"
            />
          </div>
        </div>

        <div className="user-info-item">
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
        <div className="user-info-item">
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
        <div className="user-info-item">
          <label className="label">Địa chỉ Email (*)</label>
          <input
            readOnly
            type="email"
            name="email"
            value={personalInfo.email}
            className="input-field"
          />
        </div>
        <div className="user-info-item">
          <label className="label">Số dư</label>
          <input
            readOnly
            type="text"
            name="balance"
            value={`${personalInfo.balance} VNĐ`}
            className="input-field"
          />
          <button className="deposit_bt" onClick={handleDeposit}>Nạp tiền</button>
        </div>
        <div className="user-info-item">
          <label className="label">Vai trò</label>
          <input
            readOnly
            type="int"
            name="status"
            value={personalInfo.type === 'customer' ? 'Khách hàng' : 'Thợ'}
            className="input-field"
          />
          {personalInfo.type === 'customer' && (
            <button className="deposit_bt" onClick={handleRegisterWorker}>
              Đăng ký làm thợ
            </button>
          )}
          {personalInfo.type !== 'customer' && (
            <button 
              className="deposit_bt" 
              onClick={() => setShowCertificateModal(true)}
            >
              Thêm chứng chỉ
            </button>
          )}
        </div>
        <div className="user-info-item">
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
        <div className="user-info-item">
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
        <div className="user-info-item">
          <label className="label">Mô tả</label>
          <textarea
            name="description"
            value={personalInfo.description}
            onChange={handleChange}
            className="textarea-field"
            placeholder="Nhập mô tả"
          />
        </div>

        {showCertificateModal && (
          <div className="certificate-modal">
            <div className="modal-content">
              <h3>Tải lên chứng chỉ</h3>
              <div
                className="upload-area"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  handleCertificateUpload({ target: { files } });
                }}
                onClick={() => document.querySelector('.certificate-upload').click()} // Cho phép click để mở file input
              >
                <p>Nhấn vào đây hoặc kéo thả file để tải lên</p>
                <p className="upload-limits">(Tối đa 4 file, 10 MB mỗi file, tổng 40 MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCertificateUpload}
                  className="certificate-upload"
                  style={{ display: 'none' }} // Ẩn input, chỉ hiển thị khu vực kéo-thả
                />
              </div>
              <div className="certificates-preview">
                {newCertificates.map((cert, index) => (
                  <div key={index} className="certificate-item">
                    <img src={cert.preview} alt="Chứng chỉ" className="certificate-image" />
                    <textarea
                      value={cert.description}
                      onChange={(e) => handleCertificateDescription(index, e.target.value)}
                      placeholder="Mô tả chứng chỉ"
                      className="certificate-description"
                    />
                    <button
                      className="remove-certificate"
                      onClick={() => handleRemoveCertificate(index)}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
              <div className="modal-buttons">
                <button onClick={handleSaveCertificates} className="save-certificate">
                  Lưu chứng chỉ
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="cancel-certificate"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="button-group">
          <button className="save-button" onClick={handleSave}>Lưu Thay Đổi</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInfo;