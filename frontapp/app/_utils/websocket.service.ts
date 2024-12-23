import { io, Socket } from 'socket.io-client';
import store from '../store';
import { addNotification } from '../store/slices/notificationSlice';

class WebSocketService {
  public socket: Socket | null = null;

  connect(userId: string) {
    this.socket = io('http://localhost:3000/ws', {
      query: { userId },
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('notification', (notification) => {
      store.dispatch(addNotification(notification));
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setTimeout(() => this.connect(userId), 1000);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      setTimeout(() => this.connect(userId), 1000);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new WebSocketService();