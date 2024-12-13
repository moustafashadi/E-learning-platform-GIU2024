import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './chat/chat.schema'
import { ForumSchema } from './forum/forum.schema'
import { NotificationSchema } from './notifications/notification.schema'
import { ChatController } from './chat/chat.controller';
import { chatService } from './chat/chat.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GateWay } from './chat/chat.gateway';
import { NotificationController } from './notifications/notification.controller';
import { NotificationService } from './notifications/notification.service';
import { MessageSchema } from './messages/message.schema';
import { MessageController } from './messages/message.controller';
import { MessageService } from './messages/message.service';

@Module({
    
    imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
              MongooseModule.forFeature([{ name: 'Forum', schema: ForumSchema }]),
              MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
              MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
            UserModule, JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
            })], 
    controllers: [ChatController,NotificationController,MessageController],
    providers: [chatService,NotificationService,GateWay,MessageService],
})
    
export class CommunicationModule {}
