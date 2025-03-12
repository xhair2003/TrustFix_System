import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, updateUserInfo, resetError, resetSuccess } from '../../../store/actions/userActions'; // Import action getUserInfo
import './PersonalInfomation.scss';
import BusinessCard from './BusinessCard';
import UpdateInfo from './UpdateInfo';
import Loading from '../../../component/Loading/Loading';
import Swal from "sweetalert2";

const PersonalInfomation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfo()); // Gọi action để lấy thông tin người dùng
  }, [dispatch]);

  const { loading, userInfo, error, updateInfoSuccess, updateInfoError } = useSelector((state) => state.user); // Lấy thông tin từ Redux

  //console.log(userInfo);
  console.log(updateInfoSuccess);
  console.log(updateInfoError);
  console.log(loading);

  // Nếu userInfo chưa có, hiển thị thông báo hoặc giá trị mặc định
  if (!userInfo) {
    return <Loading />; // Hiển thị Loading khi đang chờ API
  }

  const handleSave = (updatedInfo) => {
    dispatch(resetError());
    dispatch(resetSuccess());

    dispatch(updateUserInfo(updatedInfo)).then(() => {
      // Check for success or error after the dispatch completes
      if (updateInfoSuccess) {
        Swal.fire({
          title: "Thành công",
          text: updateInfoSuccess,
          icon: "info",
          timer: 5000,
          showConfirmButton: false,
        });
      } else if (updateInfoError) {
        Swal.fire({
          title: "Lỗi",
          text: updateInfoError,
          icon: "error",
          timer: 5000,
          showConfirmButton: false,
        });
      }
      // Fetch user info again after update
      dispatch(getUserInfo());
    });
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>; // Hiển thị lỗi nếu có
  }

  // Kiểm tra userInfo trước khi truy cập thuộc tính
  const username = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Người dùng chưa đăng nhập"; // Cung cấp giá trị mặc định

  return (
    <div className='history-container'>
      {loading && <Loading />}
      <div className='history-form'>
        <h2 className='complaint-title'>THÔNG TIN CÁ NHÂN</h2>
        <div className='personalInfomation-form'>
          <BusinessCard
            username={username}
            balance={userInfo?.balance || 0} // Sử dụng toán tử điều kiện
            email={userInfo?.email || "Chưa có email"} // Cung cấp giá trị mặc định
            phone={userInfo?.phone || "Chưa có số điện thoại"} // Cung cấp giá trị mặc định
            type={userInfo?.type === "repairman" ? 'Thợ' : 'Khách hàng'}
            avatar={userInfo?.imgAvt || "default-avatar.png"} // Cung cấp giá trị mặc định
            address={userInfo?.address || "Chưa có địa chỉ"} // Cung cấp giá trị mặc định
            description={userInfo?.description || "Chưa có mô tả"} // Cung cấp giá trị mặc định
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