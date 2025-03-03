import React from "react";
import EditProfileForm from "../../../component/common/forms/EditProfileForm";
import "./PersonalInformation.scss";

const PersonalInformation = () => {
    return (
        <div className="edit-profile-page">
            <h4 className="title">Thông tin cá nhân</h4>
            <div className="divider"></div>
            <EditProfileForm />
        </div>
    );
};

export default PersonalInformation;
