// notification/notification.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
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
    // Get all enrolled students
    const enrolledStudents = course.students;

    // Send notification to each enrolled student
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
}