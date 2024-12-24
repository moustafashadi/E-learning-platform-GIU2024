import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from '../course/models/course.schema';
import { JwtModule } from '@nestjs/jwt';
import { InstructorSchema, StudentSchema, UserSchema, AdminSchema } from 'src/user/models/user.schema';
import { CourseController } from '../course/controllers/course.controller';
import { CourseService } from '../course/services/course.service';
import { QuizSchema } from 'src/quiz/models/quiz.schema';
import { QuizService } from 'src/quiz/services/quiz.service';
import { QuestionService } from 'src/quiz/services/question.service';
import { QuestionSchema } from 'src/quiz/models/question.schema';
import { ProgressService } from 'src/progress/services/progress.service';
import { ProgressSchema } from 'src/progress/models/progress.schema';
import WebSocketService from '../../frontapp/app/_utils/websocket.service';
import { NotificationService } from 'src/communication/notifications/notification.service';
import { NotificationGateway } from 'src/communication/notifications/notification.gateway';
import { CommunicationModule } from 'src/communication/communication.module';
import { NotificationSchema } from 'src/communication/notifications/notification.schema';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Instructor', schema: InstructorSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Question', schema: QuestionSchema },
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Notification', schema: NotificationSchema },
      { name: 'Admin', schema: AdminSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    CommunicationModule,
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    QuizService,
    QuestionService,
    ProgressService,
    NotificationService,
    NotificationGateway,
    UserService,
  ],
  exports: [CourseService, MongooseModule], // Export MongooseModule to make CourseModel available
})
export class CourseModule {}