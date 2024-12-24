import { io, Socket } from 'socket.io-client';
import store from '../store';
import { addNotification } from '../store/slices/notificationSlice';

class WebSocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    this.socket = io('http://localhost:3000', {
      query: { userId }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('notification', (notification) => {
      store.dispatch(addNotification(notification));
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
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