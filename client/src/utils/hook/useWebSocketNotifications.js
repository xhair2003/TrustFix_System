import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import socket from "../../socket";
import { viewRequest } from "../../store/actions/userActions";

const useWebSocketNotifications = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Chỉ lắng nghe newRequest
        socket.on('newRequest', () => {
            console.log('New request received via WebSocket');
            dispatch(viewRequest()); // Re-fetch dữ liệu viewRequest
            Swal.fire({
                icon: "info",
                title: "Có đơn hàng mới",
                text: "Một yêu cầu sửa chữa mới đã được tạo!",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        });

        socket.on('connect', () => console.log('WebSocket connected:', socket.id));
        socket.on('connect_error', (err) => console.error('WebSocket connect error:', err));

        return () => {
            socket.off('newRequest');
            socket.off('connect');
            socket.off('connect_error');
        };
    }, [dispatch]);
};

export default useWebSocketNotifications;