import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsSchema } from '../analytics/models/analytics.schema'
import { AnalyticsController } from './controllers/analytics.controller';
import { QuizService } from 'src/quiz/services/quiz.service';
import { Instructor, InstructorSchema, StudentSchema } from 'src/user/models/user.schema';
import { CourseSchema } from 'src/course/models/course.schema';
import { QuizSchema } from 'src/quiz/models/quiz.schema';
import { QuestionService } from 'src/quiz/services/question.service';
import { QuestionSchema } from 'src/quiz/models/question.schema';
import { ProgressService } from 'src/progress/services/progress.service';
import { ProgressSchema } from 'src/progress/models/progress.schema';
import { NotificationGateway } from 'src/communication/notifications/notification.gateway';
import { PerformanceMatrixSchema } from 'src/analytics/models/performanceMatrix.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Analytics', schema: AnalyticsSchema }]),
      MongooseModule.forFeature([{ name: 'Instructor', schema: InstructorSchema }]),
      MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
      MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
      MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]),
      MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }]),
      MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }]),
      MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
      MongooseModule.forFeature([{ name: 'Performance', schema: PerformanceMatrixSchema }]),
    ],
    controllers: [AnalyticsController],
    providers: [QuizService,QuestionService, ProgressService,NotificationGateway],
  })
  export class AnalyticsModule {}
