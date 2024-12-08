import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from '../communication/models/chat.schema'
import { ForumSchema } from '../communication/models/forum.schema'
import { NotificationSchema } from '../communication/models/notification.schema'
import { ChatController } from './controllers/chat.controller';
import { chatService } from './services/chat.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GateWay } from './gateway/chat.gateway';

@Module({
    
    imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
              MongooseModule.forFeature([{ name: 'Forum', schema: ForumSchema }]),
              MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
            UserModule, JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
            })], 
    controllers: [ChatController,],
    providers: [chatService,GateWay],
})
    
export class CommunicationModule {}
