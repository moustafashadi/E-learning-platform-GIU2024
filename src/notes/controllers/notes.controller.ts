import {Controller, Post, Get, Put, Delete, Body, Param, Req,} from '@nestjs/common';
  import { NotesService } from '../services/notes.service';
  import { CreateNoteDto } from '../dto/create-notes.dto';
  import { UpdateNoteDto } from '../dto/update-notes.dto';
  import { Request } from 'express';
  
  @Controller('notes')
  export class NotesController {
    constructor(private readonly notesService: NotesService) {}
  
    /**
     * Create a new note
     * @param createNoteDto Data for creating a note
     * @param req Request object (should include user data from middleware)
     */
    @Post()
    async createNote(
      @Body() createNoteDto: CreateNoteDto,
      @Req() req: Request,
    ) {
      // Extract userId from the request object (assumes middleware adds it)
      const userId = req.user?.id || 'guest'; // Replace 'guest' with proper logic if needed
      const newNote = await this.notesService.create({
        ...createNoteDto,
        userId,
      });
      return { message: 'Note created successfully', note: newNote };
    }
  
    /**
     * Retrieve all notes for the user
     * @param req Request object
     */
    @Get()
    async findAllNotes(@Req() req: Request) {
      const userId = req.user?.id || 'guest'; // Replace 'guest' with proper logic if needed
      const notes = await this.notesService.findAll();
      return { notes };
    }
  
    /**
     * Retrieve a specific note by ID
     * @param noteId ID of the note to retrieve
     * @param req Request object
     */
    @Get(':id')
    async findNoteById(@Param('id') noteId: string, @Req() req: Request) {
      const userId = req.user?.id || 'guest';
      const note = await this.notesService.findById(noteId, userId);
      if (!note) {
        return { message: 'Note not found' };
      }
      return { note };
    }
  
    /**
     * Update a note by ID
     * @param noteId ID of the note to update
     * @param updateNoteDto Data to update the note
     * @param req Request object
     */
    @Put(':id')
    async updateNote(
      @Param('id') noteId: string,
      @Body() updateNoteDto: UpdateNoteDto,
      @Req() req: Request,
    ) {
      const userId = req.user?.id || 'guest';
      const updatedNote = await this.notesService.update(noteId, userId, updateNoteDto);
      if (!updatedNote) {
        return { message: 'Note not found or not authorized to update' };
      }
      return { message: 'Note updated successfully', note: updatedNote };
    }
  
    /**
     * Delete a note by ID
     * @param noteId ID of the note to delete
     * @param req Request object
     */
    @Delete(':id')
    async deleteNote(@Param('id') noteId: string, @Req() req: Request) {
      const userId = req.user?.id || 'guest';
      const deleted = await this.notesService.delete(noteId, userId);
      if (!deleted) {
        return { message: 'Note not found or not authorized to delete' };
      }
      return { message: 'Note deleted successfully' };
    }
  }
  