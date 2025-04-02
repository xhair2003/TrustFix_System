import io from 'socket.io-client';

const socket = io('http://localhost:8080', {
    reconnection: true,
    reconnectionAttempts: 5,
    auth: { token: localStorage.getItem('token') }
});

socket.on('connect', () => console.log('WebSocket connected:', socket.id));
socket.on('connect_error', (err) => console.error('WebSocket connect error:', err));
socket.on('error', (err) => console.error('WebSocket error:', err));

export default socket;