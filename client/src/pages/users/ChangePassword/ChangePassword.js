// import { useState } from 'react';
// import './ChangePassword.css';

// const ChangePassword = () => {
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//     });
//     const [showPassword, setShowPassword] = useState(false);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError({
//             currentPassword: '',
//             newPassword: '',
//             confirmPassword: ''
//         });

//         let hasError = false;

//         if (newPassword !== confirmPassword) {
//             setError(prev => ({ ...prev, confirmPassword: 'Mật khẩu mới và xác nhận không khớp.' }));
//             hasError = true;
//         }

//         if (newPassword.length < 6) {
//             setError(prev => ({ ...prev, newPassword: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }));
//             hasError = true;
//         }

//         if (hasError) return;

//         console.log('Mật khẩu đã được thay đổi.');
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     return (
//         <div className="password-change-form">
//             <h2>Đổi Mật Khẩu</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
//                     <input
//                         type={showPassword ? 'text' : 'password'}
//                         id="currentPassword"
//                         value={currentPassword}
//                         onChange={(e) => setCurrentPassword(e.target.value)}
//                         required
//                     />
//                     {error.currentPassword && <p className="error">{error.currentPassword}</p>}
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="newPassword">Mật khẩu mới</label>
//                     <input
//                         type={showPassword ? 'text' : 'password'}
//                         id="newPassword"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                         required
//                     />
//                     {error.newPassword && <p className="error">{error.newPassword}</p>}
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
//                     <input
//                         type={showPassword ? 'text' : 'password'}
//                         id="confirmPassword"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                     />
//                     {error.confirmPassword && <p className="error">{error.confirmPassword}</p>}
//                 </div>
//                 <div className="show-password">
//                     <input
//                         type="checkbox"
//                         checked={showPassword}
//                         onChange={togglePasswordVisibility}
//                     />
//                     <span>Hiển thị mật khẩu</span>
//                 </div>
//                 <button type="submit" className="submit-btn">Xác Nhận</button>
//             </form>
//         </div>
//     );
// };

// export default ChangePassword;



import { useState } from 'react';
import './ChangePassword.css';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });

        let hasError = false;

        if (newPassword !== confirmPassword) {
            setError(prev => ({ ...prev, confirmPassword: 'Mật khẩu mới và xác nhận không khớp.' }));
            hasError = true;
        }

        if (newPassword.length < 6) {
            setError(prev => ({ ...prev, newPassword: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }));
            hasError = true;
        }

        if (hasError) return;

        // Gọi hàm để thay đổi mật khẩu
        await changePassword(currentPassword, newPassword);
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            // Thay thế URL_API với URL thực tế của API
            const response = await fetch('URL_API', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi khi thay đổi mật khẩu.');
            }

            const data = await response.json();
            console.log('Mật khẩu đã được thay đổi:', data);
            // Xử lý phản hồi từ API nếu cần
        } catch (error) {
            console.error('Lỗi:', error);
            // Cập nhật thông báo lỗi nếu cần
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="password-change-form">
            <h2>Đổi Mật Khẩu</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    {error.currentPassword && <p className="error">{error.currentPassword}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    {error.newPassword && <p className="error">{error.newPassword}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error.confirmPassword && <p className="error">{error.confirmPassword}</p>}
                </div>
                <div className="show-password">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={togglePasswordVisibility}
                    />
                    <span>Hiển thị mật khẩu</span>
                </div>
                <button type="submit" className="submit-btn">Xác Nhận</button>
            </form>
        </div>
    );
};

export default ChangePassword;