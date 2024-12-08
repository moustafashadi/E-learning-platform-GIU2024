import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from '../course/models/course.schema';
import { UserSchema } from 'src/user/models/user.schema';
import { CourseController } from '../course/controllers/course.controller';
import { CourseService } from '../course/services/course.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
