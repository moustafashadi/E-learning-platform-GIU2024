import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  
  import { AuthService } from '../../auth/auth.service';
  import { MessageService } from '../messages/message.service';
  import { CreateMessageDto } from '../messages/dto/create-message.dto';
  
  @WebSocketGateway({ cors: { origin: '*' } })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
      private readonly messageService: MessageService,
      private readonly authService: AuthService,
    ) {}
  
    handleConnection(client: Socket) {
      const token = client.handshake.auth.token;
      const payload = this.authService.verifyToken(token);
  
      if (!payload) {
        client.disconnect(true);
      } else {
        console.log(`Client ${client.id} connected. Auth token: ${token}`);
      }
    }
  
    @SubscribeMessage('join')
    handleJoin(client: Socket, chatId: string) {
      console.log(`Client ${client.id} joined chat: ${chatId}`);
      client.join(chatId.toString());
      return chatId;
    }
  
    @SubscribeMessage('leave')
    handleLeave(client: Socket, chatId: string) {
      console.log(`Client ${client.id} leaved chat: ${chatId}`);
      client.leave(chatId.toString());
      return chatId;
    }
  
    @SubscribeMessage('message')
    async handleMessage(client: Socket, createMessageDto: CreateMessageDto) {
      console.log(`Client ${client.id} sent message: ${createMessageDto.message}`);
      const message = await this.messageService.createMessage(createMessageDto);
      client.emit('message', message);
      client.to(createMessageDto.chat.toString()).emit('message', message);
    }
  
    @SubscribeMessage('isTyping')
    async handleTypingNotification(client: Socket, chatId: CreateMessageDto) {
      console.log(`Client ${client.id} typing message to chat: ${chatId}`);
      client
        .to(chatId.toString())
        .emit('isTyping', `${client.id} typing message...`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client ${client.id} disconnected`);
    }
  }