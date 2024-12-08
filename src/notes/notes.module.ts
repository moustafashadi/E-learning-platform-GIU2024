import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './models/notes.schema';
import { CourseSchema } from '../course/models/course.schema';
import { NotesController } from './controllers/notes.controller';
import { NotesService } from './services/notes.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Notes', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Courses', schema: CourseSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule { }
