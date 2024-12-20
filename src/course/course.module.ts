import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from '../course/models/course.schema';
import { JwtModule } from '@nestjs/jwt';
import { InstructorSchema, StudentSchema, UserSchema } from 'src/user/models/user.schema';
import { CourseController } from '../course/controllers/course.controller';
import { CourseService } from '../course/services/course.service';
import { QuizSchema } from 'src/quiz/models/quiz.schema';
import { QuizService } from 'src/quiz/services/quiz.service';
import { QuestionService } from 'src/quiz/services/question.service';
import { QuestionSchema } from 'src/quiz/models/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Instructor', schema: InstructorSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'Quiz', schema: QuizSchema},
      { name: 'Question', schema: QuestionSchema},
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
     })
  ],
  controllers: [CourseController],
  providers: [CourseService, QuizService, QuestionService],
  exports: [CourseService],
})
export class CourseModule {}
