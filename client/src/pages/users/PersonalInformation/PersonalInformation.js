import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../../store/actions/userActions'; // Import action getUserInfo
import './PersonalInfomation.scss';
import BusinessCard from './BusinessCard';
import UpdateInfo from './UpdateInfo';
import Loading from '../../../component/Loading/Loading';

const PersonalInfomation = () => {
  const dispatch = useDispatch();
  const { loading, userInfo, error } = useSelector((state) => state.user); // Lấy thông tin từ Redux
  console.log(userInfo);

  useEffect(() => {
    dispatch(getUserInfo()); // Gọi action để lấy thông tin người dùng
  }, [dispatch]);

  const handleSave = (updatedInfo) => {
    // Cập nhật thông tin cá nhân
  };

  if (loading) {
    return <Loading />; // Hiển thị Loading khi đang chờ API
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>; // Hiển thị lỗi nếu có
  }

  const username = `${userInfo?.firstName} ${userInfo?.lastName}` || "";

  return (
    <div className='history-container'>
      <div className='history-form'>
        <h2 className='complaint-title'>THÔNG TIN CÁ NHÂN</h2>
        <div className='personalInfomation-form'>
          <BusinessCard
            username={username}
            balance={0}
            email={userInfo.email}
            phone={userInfo.phone}
            status={userInfo.status === 0 ? 'Thợ' : 'Khách hàng'}
            avatar={userInfo.imgAvt}
            address={userInfo.address}
            description={userInfo.description}
          />
          <UpdateInfo
            initialData={userInfo}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfomation;