import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './models/notes.schema';
import { CourseSchema } from '../course/models/course.schema';
import { NotesController } from './controllers/notes.controller';
import { NotesService } from './services/notes.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { UserSchema, AdminSchema, StudentSchema, InstructorSchema } from 'src/user/models/user.schema';
import { ProgressSchema } from 'src/progress/models/progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: 'Instructor', schema: InstructorSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [NotesController],
  providers: [NotesService, UserService],
})
export class NotesModule { }
