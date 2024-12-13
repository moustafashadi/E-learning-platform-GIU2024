import { Injectable, NotFoundException, Param, Body, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Note, NoteDocument } from '../models/notes.schema';
import { CreateNoteDto } from '../dto/create-notes.dto';
import { UpdateNoteDto } from '../dto/update-notes.dto';
import { CourseDocument } from 'src/course/models/course.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Notes') private noteModel: Model<NoteDocument>,
    @InjectModel('Course') private courseModel: Model<CourseDocument>
  ) { }

  async findById(noteId: string, userId: string): Promise<Note | null> {
    const note = await this.noteModel.findOne({ _id: noteId, userId }).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  //TESTED - WORKING
  async createNoteForCourse(courseId: string, content: string, userId: string): Promise<Note> {
    try {
      const course = await this.courseModel.findById(courseId).exec();
      if (!course) {
        throw new NotFoundException('Course not found');
      }

      const newNote = new this.noteModel({
        courseId: new Types.ObjectId(courseId),  // Explicitly set courseId
        content,
        userId: new Types.ObjectId(userId),
        isPinned: false,
        created_at: new Date(),
        last_updated: new Date()
      });

      const savedNote = await newNote.save();
      console.log('Saved note:', savedNote); // Debug log
      return savedNote;
    } catch (error) {
      console.error('Error creating note:', error);
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async findAll(userId: String): Promise<Note[]> {
    try {
      const notes = await this.noteModel.find({ userId }).exec();

      if (!notes) {
        throw new NotFoundException('No notes found');
      }
      return notes;
    } catch (error) {
      throw new Error('Error fetching notes');
    }
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(noteId: string, userId: string, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    const note = await this.noteModel.findOne({ _id: noteId, userId }).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found or not owned by the user`);
    }

    const updatedNote = await this.noteModel.findByIdAndUpdate(
      noteId,
      { ...updateNoteDto },
      { new: true },
    ).exec();

    return updatedNote;
  }

  async delete(noteId: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findOne({ _id: noteId, userId }).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found or not owned by the user`);
    }

    const deletedNote = await this.noteModel.findByIdAndDelete(noteId).exec();
    return deletedNote;
  }
}