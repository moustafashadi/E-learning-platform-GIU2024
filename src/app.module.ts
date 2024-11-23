import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { InstructorModule } from './instructor/instructor.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [AdminModule, UserModule, InstructorModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
