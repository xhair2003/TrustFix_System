// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import socket from '../../socket'; // Import your socket instance
// import { logout } from '../../store/actions/authActions';

// const SocketListenerUserBanned = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const handleUserBanned = (data) => {
//             console.log('User banned event received:', data);
//             // Dispatch logout action to clear auth state and token
//             dispatch(logout());
//             // Navigate to /login
//             navigate('/login');
//             // Optional: Show notification
//             alert(data.message);
//         };

//         if (socket.connected) {
//             console.log('Socket connected, listening for userBanned event');
//             socket.on('userBanned', handleUserBanned);
//         } else {
//             console.warn('Socket not connected yet. Waiting...');
//             const onConnect = () => {
//                 console.log('Socket connected, setting up userBanned listener');
//                 socket.on('userBanned', handleUserBanned);
//             };
//             socket.on('connect', onConnect);

//             return () => {
//                 socket.off('connect', onConnect);
//             };
//         }

//         return () => {
//             console.log('Cleaning up userBanned listener');
//             socket.off('userBanned', handleUserBanned);
//         };
//     }, [dispatch, navigate]);

//     return null;
// };

// export default SocketListenerUserBanned;


// src/utils/socket/SocketListenerUserBanned.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket'; // Import your socket instance
import { logout } from '../../store/actions/authActions';

const SocketListenerUserBanned = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Log socket instance for debugging
        console.log('SocketListenerUserBanned mounted, socket:', socket);

        const handleUserBanned = (data) => {
            console.log('User banned event received:', data);
            // Dispatch logout action
            dispatch(logout());
            // Navigate to /login
            navigate('/login', { replace: true });
            // Show notification
            alert(data.message);
        };

        // Check initial socket connection
        if (socket.connected) {
            console.log('Socket connected, listening for userBanned event');
            socket.on('userBanned', handleUserBanned);
        } else {
            console.warn('Socket not connected yet. Waiting...');
            const onConnect = () => {
                console.log('Socket connected, setting up userBanned listener');
                // Log socket auth to verify user ID
                console.log('Socket auth:', socket.auth);
                socket.on('userBanned', handleUserBanned);
            };
            socket.on('connect', onConnect);

            // Log connection errors
            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error.message);
            });

            // Attempt to connect if not already trying
            if (!socket.connecting) {
                console.log('Attempting socket connection');
                socket.connect();
            }

            return () => {
                console.log('Cleaning up connect listener');
                socket.off('connect', onConnect);
                socket.off('connect_error');
            };
        }

        return () => {
            console.log('Cleaning up userBanned listener');
            socket.off('userBanned', handleUserBanned);
        };
    }, [dispatch, navigate]);

    return null;
};

export default SocketListenerUserBanned;