import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsSchema } from '../analytics/models/analytics.schema'
import { AnalyticsController } from './controllers/analytics.controller';
import { QuizService } from 'src/quiz/services/quiz.service';
import { Instructor, InstructorSchema } from 'src/user/models/user.schema';
import { CourseSchema } from 'src/course/models/course.schema';
import { QuizSchema } from 'src/quiz/models/quiz.schema';
@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Analytics', schema: AnalyticsSchema }]),
      MongooseModule.forFeature([{ name: 'Instructor', schema: InstructorSchema }]),
      MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
      MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]),
    ],
    controllers: [AnalyticsController],
    providers: [QuizService],
  })
  export class AnalyticsModule {}
