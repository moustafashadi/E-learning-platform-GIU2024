import { Injectable, NotFoundException, Param, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Note, NoteDocument } from '../models/notes.schema';
import { CreateNoteDto } from '../dto/create-notes.dto';
import { UpdateNoteDto } from '../dto/update-notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Notes') private noteModel: Model<NoteDocument>,
    @InjectModel('Courses') private courseModel: Model<any> // Replace 'any' with the appropriate type if available
  ) { }

  async findById(noteId: string, userId: string): Promise<Note | null> {
    const note = await this.noteModel.findOne({ _id: noteId, userId }).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  //CREATE NOTE IMPLEMENTATION ACCORDING TO NOTES.CONTROLLER.TS
  async create(courseId: string, content: string, userId: string): Promise<Note> {
    try {
      const course = await this.courseModel.findById(courseId);
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      const newNote = await this.noteModel.create({
        courseId,
        content,
        userId,
      });
      return newNote;
    } catch (error) {
      throw new Error(error.message);
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
    // Ensure the note belongs to the user
    const note = await this.noteModel.findOne({ _id: noteId, userId }).exec();
    if (!note) {
      // Note not found or doesn't belong to the user
      throw new NotFoundException(`Note with ID ${noteId} not found or not owned by the user`);
    }

    // Update the note
    const updatedNote = await this.noteModel.findByIdAndUpdate(
      noteId,
      { ...updateNoteDto },
      { new: true },
    ).exec();

    return updatedNote;
  }

  async delete(noteId: string, userId: string): Promise<Note> {
    // Find the note by ID and ensure it belongs to the user
    const note = await this.noteModel.findOne({ _id: noteId, userId }).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found or not owned by the user`);
    }

    // Delete the note
    const deletedNote = await this.noteModel.findByIdAndDelete(noteId).exec();
    return deletedNote;
  }

}
