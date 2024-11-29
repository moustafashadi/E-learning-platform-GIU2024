import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema'; 
import { AdminSchema } from './models/admin.schema'; 
import { InstructorSchema } from './models/instructor.schema'; 
import { StudentSchema } from './models/student.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: 'Instructor', schema: InstructorSchema }]),
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
