import { io, Socket } from 'socket.io-client';
import { addNotification } from './notificationSlice';
import store from '../index';

const WEBSOCKET_URL = 'http://localhost:3000'; // Define the WebSocket URL

const socket: Socket = io(WEBSOCKET_URL);

socket.on('connect', () => {
  console.log('WebSocket connected');
});

socket.on('notification', (notification) => {
  store.dispatch(addNotification(notification));
});

socket.on('disconnect', () => {
  console.log('WebSocket disconnected');
});

export default socket;