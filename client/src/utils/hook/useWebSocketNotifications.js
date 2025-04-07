import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Uncomment nếu muốn dùng
import socket from "../../socket";
import { viewRequest } from "../../store/actions/userActions";

const useWebSocketNotifications = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user_id) || localStorage.getItem('user_id');

    useEffect(() => {
        if (!userId) {
            console.warn("User ID not found, WebSocket notifications will not be set up.");
            return;
        }

        // Hàm xử lý sự kiện newRequest
        const handleNewRequest = () => {
            console.log('New request received via WebSocket for user:', userId);
            dispatch(viewRequest()); // Re-fetch dữ liệu viewRequest
            // Uncomment để hiển thị thông báo cho người dùng
            // Swal.fire({
            //     icon: "info",
            //     title: "Có đơn hàng mới",
            //     text: "Một yêu cầu sửa chữa mới đã được tạo!",
            //     timer: 5000,
            //     timerProgressBar: true,
            //     showConfirmButton: false
            // });
        };

        // Đảm bảo socket đã kết nối trước khi lắng nghe
        if (socket.connected) {
            socket.on('newRequest', handleNewRequest);
        } else {
            console.warn('Socket not connected yet. Waiting for connection...');
            const onConnect = () => {
                console.log('WebSocket connected:', socket.id);
                socket.on('newRequest', handleNewRequest);
            };
            socket.on('connect', onConnect);

            // Xử lý lỗi kết nối
            const onConnectError = (err) => {
                console.error('WebSocket connect error:', err.message);
                // Có thể thêm thông báo cho người dùng nếu cần
                // Swal.fire({
                //     icon: "error",
                //     title: "Lỗi kết nối",
                //     text: "Không thể kết nối đến server. Vui lòng thử lại sau!",
                //     timer: 5000,
                //     timerProgressBar: true,
                //     showConfirmButton: false
                // });
            };
            socket.on('connect_error', onConnectError);

            // Cleanup khi component unmount hoặc socket kết nối sau
            return () => {
                if (socket.connected) {
                    socket.off('newRequest', handleNewRequest);
                }
                socket.off('connect', onConnect);
                socket.off('connect_error', onConnectError);
            };
        }

        // Cleanup khi socket đã kết nối từ đầu
        return () => {
            socket.off('newRequest', handleNewRequest);
            socket.off('connect');
            socket.off('connect_error');
        };
    }, [dispatch, userId]); // Dependency array giữ nguyên

    return null;
};

export default useWebSocketNotifications;