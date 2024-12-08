import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { StudentSchema } from './models/user.schema';
import { InstructorSchema } from './models/user.schema';
import { AdminSchema } from './models/user.schema';
import { UserSchema } from './models/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { CourseSchema } from '../course/models/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Admin', schema: AdminSchema },
      { name: 'Instructor', schema: InstructorSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'Course', schema: CourseSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtModule],
  exports: [UserService],
})
export class UserModule {} 

//All endpoints except user creation require authentication, and most require admin privileges through the @Roles decorator.
