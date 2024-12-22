// services/websocketService.ts
import { io, Socket } from 'socket.io-client';
import { store } from '../store';
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

    this.socket.on('quiz-created', (data) => {
      const notification = {
        id: Date.now().toString(),
        type: 'quiz',
        message: `New quiz available in course: ${data.courseName}`,
        read: false,
        createdAt: new Date().toISOString(),
        courseId: data.courseId,
        quizId: data.quizId
      };
      store.dispatch(addNotification(notification));
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

export const websocketService = new WebSocketService();