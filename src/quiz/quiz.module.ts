import { Module, Res } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from './models/quiz.schema';
import { QuestionSchema } from './models/question.schema';
import { QuizController } from './controllers/quiz.controller';
import { QuizService } from './services/quiz.service';
import { JwtModule } from '@nestjs/jwt';
import { ResponseSchema } from '../response/models/response.schema';
import { ResponseService } from '../response/services/response.service';
import { ResponseGateway } from '../response/gateway/response.gateway';
import { QuestionService } from './services/question.service';
import { CourseSchema } from 'src/course/models/course.schema';
import { InstructorSchema, StudentSchema } from 'src/user/models/user.schema';
import { QuestionController } from './controllers/question.controller';
import { ProgressService } from 'src/progress/services/progress.service';
import { ProgressSchema } from 'src/progress/models/progress.schema';
import { NotificationGateway } from 'src/communication/notifications/notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: 'Instructor', schema: InstructorSchema }]),
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }]),
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
     })],
  controllers: [QuizController, QuestionController],
  providers: [QuizService, ResponseService, ResponseGateway, QuestionService, ProgressService, NotificationGateway],
  exports: [QuizService],
})
export class QuizModule {}
