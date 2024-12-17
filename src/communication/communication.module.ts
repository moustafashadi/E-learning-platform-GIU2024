import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './chat/chat.schema'
import { ForumSchema } from './forum/forum.schema'
import { NotificationSchema } from './notifications/notification.schema'
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat/chat.gateway';
import { NotificationController } from './notifications/notification.controller';
import { NotificationService } from './notifications/notification.service';
import { MessageSchema } from './messages/message.schema';
import { MessageController } from './messages/message.controller';
import { MessageService } from './messages/message.service';
import { ForumController } from './forum/forum.controller';
import { ForumServices } from './forum/forum.service';
import { CourseService } from 'src/course/services/course.service';
import { CourseSchema } from 'src/course/models/course.schema';
import { InstructorSchema, StudentSchema, UserSchema } from 'src/user/models/user.schema';
import { ThreadSchema } from './forum/Thread.schema';
import { HttpService } from '@nestjs/axios';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from 'src/auth/auth.service';

@Module({
    
    imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
              MongooseModule.forFeature([{ name: 'Forum', schema: ForumSchema }]),
              MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
              MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
              MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
              MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
              MongooseModule.forFeature([{ name: 'Instructor', schema: InstructorSchema }]),
              MongooseModule.forFeature([{ name: 'Thread', schema: ThreadSchema }]),
              MongooseModule.forFeature([{ name: 'Instructor', schema: InstructorSchema }]),
              MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
            UserModule, JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
            }),
        HttpModule.register({
            timeout: 5000,
        }),], 
    controllers: [ChatController,NotificationController,MessageController,ForumController],
    providers: [ChatService,NotificationService,ChatGateway,MessageService,ForumServices,CourseService, JwtService,AuthService],
})
    
export class CommunicationModule {}
