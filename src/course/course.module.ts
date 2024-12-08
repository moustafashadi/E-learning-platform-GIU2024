import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from '../course/models/course.schema';
import { JwtModule } from '@nestjs/jwt';
import { InstructorSchema, UserSchema } from 'src/user/models/user.schema';
import { CourseController } from '../course/controllers/course.controller';
import { CourseService } from '../course/services/course.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Instructor', schema: InstructorSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
     })
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
