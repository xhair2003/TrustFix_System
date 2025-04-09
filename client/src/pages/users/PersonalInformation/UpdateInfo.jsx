import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateInfo.scss';
import { requestSupplementaryPracticeCertificate, resetError, resetSuccess } from '../../../store/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import Swal from "sweetalert2";
import Loading from '../../../component/Loading/Loading';
import { FaCheck, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const UpdateInfo = ({ initialData, onSave }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, successSupplementary, errorSupplementary } = useSelector((state) => state.user);

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
    certificates: initialData.certificates || [],
    repairmanUpgradeRequests: initialData.repairmanUpgradeRequests || {},
  });

  const [phoneError, setPhoneError] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [newCertificates, setNewCertificates] = useState([]);
  // Thêm state để lưu lỗi cho firstName và lastName
  const [nameErrors, setNameErrors] = useState({ firstName: '', lastName: '' });
  const [showPracticeCertificateModal, setShowPracticeCertificateModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Lấy tất cả các ảnh chứng chỉ vào một mảng
  const getAllCertificates = () => {
    const certificates = [];
    const request = personalInfo.repairmanUpgradeRequests[0];
    if (request?.imgCertificatePractice) {
      certificates.push(request.imgCertificatePractice);
    }
    if (request?.supplementaryPracticeCertificate) {
      certificates.push(...request.supplementaryPracticeCertificate);
    }
    return certificates;
  };

  const allCertificates = getAllCertificates();

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < allCertificates.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : allCertificates.length - 1
    );
  };

  useEffect(() => {
    if (successSupplementary) {
      Swal.fire({
        title: "Thành công",
        text: successSupplementary,
        icon: "info",
        timer: 5000,
        showConfirmButton: false,
        showCloseButton: false,
        timerProgressBar: true,
      }).then(() => {
        setNewCertificates([]);
        setShowCertificateModal(false);
        dispatch(resetSuccess());
      });
    }
    if (errorSupplementary) {
      Swal.fire({
        title: "Lỗi",
        text: errorSupplementary,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
        showCloseButton: false,
        timerProgressBar: true,
      });
      dispatch(resetError());
    }
  }, [dispatch, successSupplementary, errorSupplementary]);

  if (loading) return <Loading />;

  // Thêm hàm validateName
  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/; // Chỉ cho phép chữ cái và khoảng trắng, hỗ trợ tiếng Việt
    return nameRegex.test(name);
  };

  // Sửa hàm handleChange để validate firstName và lastName
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

    if (name === 'firstName' || name === 'lastName') {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        setNameErrors(prev => ({
          ...prev,
          [name]: `${name === 'firstName' ? 'Họ' : 'Tên'} là bắt buộc`
        }));
      } else if (!validateName(trimmedValue)) {
        setNameErrors(prev => ({
          ...prev,
          [name]: `${name === 'firstName' ? 'Họ' : 'Tên'} không được chứa ký tự đặc biệt`
        }));
      } else {
        setNameErrors(prev => ({ ...prev, [name]: '' }));
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

    if (files.length + newCertificates.length > maxFiles) {
      alert(`Bạn chỉ có thể tải lên tối đa ${maxFiles} ảnh!`);
      return;
    }

    const newCerts = files.map((file) => {
      if (!validTypes.includes(file.type)) {
        alert('Vui lòng chỉ tải lên ảnh định dạng JPG, PNG hoặc JPEG!');
        return null;
      }

      if (file.size > maxSize) {
        alert(`Kích thước file ${file.name} vượt quá 10MB!`);
        return null;
      }

      return {
        file: file,
        preview: URL.createObjectURL(file),
      };
    }).filter((cert) => cert !== null);

    setNewCertificates((prev) => [...prev, ...newCerts]);
  };

  const handleRemoveCertificate = (index) => {
    setNewCertificates(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveCertificates = () => {
    if (newCertificates.length === 0) {
      Swal.fire({
        title: "Thông báo",
        text: "Vui lòng tải lên ít nhất một chứng chỉ!",
        icon: "warning",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    const certificateFiles = newCertificates.map(cert => cert.file);
    dispatch(requestSupplementaryPracticeCertificate(certificateFiles));
  };

  // Sửa hàm handleSave để kiểm tra lỗi trước khi lưu
  const handleSave = () => {
    const trimmedFirstName = personalInfo.firstName.trim();
    const trimmedLastName = personalInfo.lastName.trim();

    let validationErrors = {};
    if (!trimmedFirstName) {
      validationErrors.firstName = 'Họ là bắt buộc';
    } else if (!validateName(trimmedFirstName)) {
      validationErrors.firstName = 'Hử không được chứa ký tự đặc biệt';
    }
    if (!trimmedLastName) {
      validationErrors.lastName = 'Tên là bắt buộc';
    } else if (!validateName(trimmedLastName)) {
      validationErrors.lastName = 'Tên không được chứa ký tự đặc biệt';
    }

    if (phoneError || Object.keys(validationErrors).length > 0) {
      setNameErrors(validationErrors);
      alert('Vui lòng kiểm tra lại thông tin trước khi lưu!');
      return;
    }

    if (onSave) {
      const updatedInfo = {
        ...personalInfo,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
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
          {nameErrors.firstName && <p className="error-text">{nameErrors.firstName}</p>}
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
          {nameErrors.lastName && <p className="error-text">{nameErrors.lastName}</p>}
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
            value={`${personalInfo.balance.toLocaleString('vi-VN')} VNĐ`}
            className="input-field"
          />
          <button className="deposit_bt" onClick={handleDeposit}>Nạp tiền</button>
        </div>
        <div className="user-info-item">
          <label className="label">Vai trò</label>
          <input
            readOnly
            type="text"
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
            <>
              <button
                className="deposit_bt"
                onClick={() => setShowPracticeCertificateModal(true)}
              >
                Xem chứng chỉ
              </button>
              <button
                className="deposit_bt"
                onClick={() => setShowCertificateModal(true)}
              >
                Bổ sung chứng chỉ
              </button>
            </>
          )}
        </div>
        {personalInfo.type === 'repairman' && (
          <div className="user-info-item">
            <label className="label">Loại thợ</label>
            <input
              readOnly
              type="text"
              value={personalInfo.repairmanUpgradeRequests[0]?.serviceIndustry_id?.type || 'Chưa xác định'}
              className="input-field"
            />
          </div>
        )}
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
              <h3>Gửi yêu cầu bổ sung chứng chỉ</h3>
              <div
                className="upload-area"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  handleCertificateUpload({ target: { files } });
                }}
                onClick={() => document.querySelector('.certificate-upload').click()}
              >
                <p>Nhấn vào đây hoặc kéo thả file để tải lên</p>
                <p className="upload-limits">(Tối đa 4 file, 10 MB mỗi file, tổng 40 MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCertificateUpload}
                  className="certificate-upload"
                  style={{ display: 'none' }}
                />
              </div>
              <div className="certificates-preview">
                {newCertificates.map((cert, index) => (
                  <div key={index} className="certificate-item">
                    <img src={cert.preview} alt="Chứng chỉ" className="certificate-image" />
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
                  Gửi yêu cầu
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


        {showPracticeCertificateModal && (
          <div className="certificate-modal">
            <div className="modal-content">
              <h3>Chứng chỉ hành nghề</h3>
              <div className="certificates-preview">
                {personalInfo.repairmanUpgradeRequests[0]?.imgCertificatePractice && (
                  <img
                    src={personalInfo.repairmanUpgradeRequests[0].imgCertificatePractice}
                    alt="Chứng chỉ chính"
                    className="certificate-image"
                    onClick={() => setSelectedImageIndex(0)}
                  />
                )}
                {personalInfo.repairmanUpgradeRequests[0]?.supplementaryPracticeCertificate?.map((cert, index) => (
                  <img
                    key={index}
                    src={cert}
                    alt={`Chứng chỉ bổ sung ${index + 1}`}
                    className="certificate-image"
                    onClick={() => setSelectedImageIndex(
                      personalInfo.repairmanUpgradeRequests[0].imgCertificatePractice ? index + 1 : index
                    )}
                  />
                ))}
              </div>
              <div className="modal-buttons">
                <button
                  onClick={() => setShowPracticeCertificateModal(false)}
                  className="cancel-certificate"
                >
                  Đóng
                </button>
              </div>

              {selectedImageIndex !== null && (
                <div className="image-viewer">
                  <button
                    className="nav-button prev-button"
                    onClick={handlePrevImage}
                  >
                    <FaArrowLeft />
                  </button>
                  <img
                    src={allCertificates[selectedImageIndex]}
                    alt="Xem chi tiết"
                    className="full-image"
                  />
                  <button
                    className="nav-button next-button"
                    onClick={handleNextImage}
                  >
                    <FaArrowRight />
                  </button>
                  <button
                    className="close-viewer"
                    onClick={() => setSelectedImageIndex(null)}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateInfo;