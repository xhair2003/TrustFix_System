import React, { useState } from 'react';
import './PersonalInfomation.scss';
import BusinessCard from './BusinessCard';
import UpdateInfo from './UpdateInfo';
const PersonalInfomation = () => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Dew',
    lastName: 'Nguyen',
    balance: '99.999 VND',
    email: 'nguyen@example.com',
    phone: '0987654321',
    imgAvt: 'https://media.istockphoto.com/id/1476170969/vi/anh/ch%C3%A2n-dung-ch%C3%A0ng-trai-tr%E1%BA%BB-s%E1%BA%B5n-s%C3%A0ng-cho-c%C3%B4ng-vi%E1%BB%87c-kh%C3%A1i-ni%E1%BB%87m-kinh-doanh.jpg?s=612x612&w=0&k=20&c=9vMopW4QPPX7yb2X1ogk76XX33N9zioXSweD_wxnYHA=',
    status: 1, // Default to Normal (1 là khách hàng)
    address: '123 Ho Chi Minh City, Vietnam',
    description: 'Không có gì ở đây hết heheheheeheheeh :))',

  });

  const getStatusText = (status) => {
    return status === 0 ? 'Thợ' : 'Khách hàng';
  };

  const handleSave = (updatedInfo) => {
    setPersonalInfo(updatedInfo);
  };


  const username = `${personalInfo.firstName}${' '}${personalInfo.lastName}`;

  return (
    <div className='history-container'>
      <div className='history-form'>
        <h2 className='complaint-title'>THÔNG TIN CÁ NHÂN</h2>
        <div className='personalInfomation-form'>
          <BusinessCard
            username={username}
            balance={personalInfo.balance}
            email={personalInfo.email}
            phone={personalInfo.phone}
            status={getStatusText(personalInfo.status)}
            avatar={personalInfo.imgAvt}
            address={personalInfo.address}
            description={personalInfo.description}
          />
          <UpdateInfo
            initialData={personalInfo}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfomation;