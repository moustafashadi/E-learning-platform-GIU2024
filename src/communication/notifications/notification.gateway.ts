import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Course } from '../../course/models/course.schema';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4000', // Your frontend URL
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Socket>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.userSockets.set(userId, client);
    console.log(`Client connected: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.userSockets.delete(userId);
    console.log(`Client disconnected: ${userId}`);
  }

  async sendQuizNotification(course: Course, quizId: string) {
    const enrolledStudents = course.students;
    enrolledStudents.forEach((studentId) => {
      const socket = this.userSockets.get(studentId.toString());
      if (socket) {
        socket.emit('quiz-created', {
          courseId: course._id,
          courseName: course.title,
          quizId: quizId
        });
      }
    });
  }

  async sendMessageNotification(userId: string, message: string) {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit('notification', { message: `New message: ${message}` });
    }
  }

  async sendReplyNotification(userId: string, message: string) {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit('notification', { message: `New reply: ${message}` });
    }
  }

  async sendAnnouncementNotification(userId: string, message: string) {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit('notification', { message: `New announcement: ${message}` });
    }
  }
}