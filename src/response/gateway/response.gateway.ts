import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Configure this properly for production
    },
  })
  export class ResponseGateway {
    @WebSocketServer() server: Server;
  
    // Client listens for 'quizResponse' events
    sendResponseToClient(userId: string, responseData: any) {
      // Emit the response data to a specific user, assuming we have a way to identify them by socket.
      // One approach is to have clients join a room named after their userId when they connect.
      this.server.to(userId).emit('quizResponse', responseData);
    }
  
    @SubscribeMessage('join')
    handleJoinRoom(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
      client.join(data.userId);
    }
  }
  