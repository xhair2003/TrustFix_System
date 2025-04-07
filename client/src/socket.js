// socket.js
import io from 'socket.io-client';

let socket;

const initializeSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No authentication token found in localStorage.');
    }

    socket = io('http://localhost:8080', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true,
        auth: { token: token || '' },
    });

    socket.on('connect', () => {
        //console.log('WebSocket connected:', socket.id);
        // Không cần emit 'join' ở đây vì backend middleware đã join room dựa trên decoded.id
    });

    socket.on('connect_error', (err) => console.error('WebSocket connect error:', err.message));
    socket.on('error', (err) => console.error('WebSocket error:', err.message));
    socket.on('disconnect', (reason) => console.log('WebSocket disconnected:', reason));
    socket.on('reconnect', (attempt) => console.log('WebSocket reconnected after', attempt, 'attempts'));

    return { socket };
};

if (!socket) {
    const { socket: newSocket } = initializeSocket();
}

export default socket;