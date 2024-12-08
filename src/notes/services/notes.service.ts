import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../models/notes.schema';
import { CreateNoteDto } from '../dto/create-notes.dto';
import { UpdateNoteDto } from '../dto/update-notes.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel('Notes') private noteModel: Model<NoteDocument>) {}

  async findById(noteId: string, userId: string): Promise<Note | null> {
    const note = await this.noteModel.findOne({ _id: noteId, userId }).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const newNote = new this.noteModel(createNoteDto);
    return newNote.save();
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
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
      return null; // Note not found or doesn't belong to the user
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
