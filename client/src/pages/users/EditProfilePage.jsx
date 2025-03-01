import React from "react";
import EditProfileForm from "../../components/common/forms/EditProfileForm";
import "../../assets/styles/pages/EditProfilePage.scss";

const EditProfilePage = () => {
    return (
        <div className="edit-profile-page">
            <h4 className="title">Personal Information</h4>
            <div className="divider"></div>
            <EditProfileForm />
        </div>
    );
};

export default EditProfilePage;
