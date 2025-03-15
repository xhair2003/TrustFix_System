import React from "react";

const UserInfoModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Details</h2>
                <div className="modal-avatar">
                    <img
                        src={user.avatar || "https://via.placeholder.com/100"} // Placeholder nếu không có avatar
                        alt={`${user.fullName}'s avatar`}
                        className="avatar-img"
                    />
                </div>
                <div className="modal-details">
                    <p><strong>Full Name:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Address:</strong> {user.address || "N/A"}</p>
                    <p><strong>Descriptions:</strong> {user.descriptions || "N/A"}</p>
                </div>
                <button className="modal-close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserInfoModal;