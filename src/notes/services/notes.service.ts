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
    const parsedNoteId = new Types.ObjectId(noteId);
    const parsedUserId = new Types.ObjectId(userId);
    const note = await this.noteModel.findOne({ _id: parsedNoteId, userId: parsedUserId }).exec();
    console.log('Note:', note._id);
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

  async findAll(userId: string): Promise<any[]> {
    // Parse userId to ObjectId
    const parsedUserId = new Types.ObjectId(userId);
  
    try {
      // Find notes and populate the courseId field to fetch course title
      const notes = await this.noteModel
        .find({ userId: parsedUserId })
        .populate('courseId', 'title') // Populate courseId to fetch only the 'title' field from Course
        .exec();
  
      if (!notes || notes.length === 0) {
        throw new NotFoundException('No notes found');
      }
  
      // Map notes to include the course title in the response
      const notesWithCourseTitle = notes.map(note => ({
        _id: note._id,
        content: note.content,
        last_updated: note.last_updated,
        courseTitle: (note.courseId as any)?.title || 'Unknown Course', // Access title via courseId
      }));
  
      return notesWithCourseTitle;
    } catch (error) {
      console.error('Error fetching notes:', error);
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
    const parsedNoteId = new Types.ObjectId(noteId);
    const parsedUserId = new Types.ObjectId(userId);
  
    // Find the note by ID and user ID
    const note = await this.noteModel.findOne({ _id: parsedNoteId, userId: parsedUserId }).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found or not owned by the user`);
    }
  
    // Update the note with the new content
    const updatedNote = await this.noteModel.findByIdAndUpdate(
      parsedNoteId,
      { ...updateNoteDto, last_updated: new Date() }, // Update content and timestamp
      { new: true } // Return the updated document
    ).exec();
  
    if (!updatedNote) {
      throw new NotFoundException(`Failed to update note with ID ${noteId}`);
    }
  
    return updatedNote;
  }
  

  async delete(noteId: string, userId: string): Promise<Note> {
    //parse noteId and userId to ObjectId
    const parsedNoteId = new Types.ObjectId(noteId);
    const parsedUserId = new Types.ObjectId(userId);
    const note = await this.noteModel.findOne({ _id: parsedNoteId, userId: parsedUserId }).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found or not owned by the user`);
    }

    const deletedNote = await this.noteModel.findByIdAndDelete(noteId).exec();
    return deletedNote;
  }
}