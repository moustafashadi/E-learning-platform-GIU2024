import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressController } from './controllers/progress.controller';
import { ProgressService } from './services/progress.service';
import { Progress, ProgressSchema } from './models/progress.schema';
import { UserSchema } from '../user/models/user.schema';
import { CourseSchema } from '../course/models/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Course', schema: CourseSchema }
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}