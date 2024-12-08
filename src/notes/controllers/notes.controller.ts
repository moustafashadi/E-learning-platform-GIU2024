import { Controller, Post, Get, Put, Delete, Body, Param, Req, UseGuards, } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-notes.dto';
import { UpdateNoteDto } from '../dto/update-notes.dto';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { Types } from 'mongoose';

@UseGuards(AuthenticationGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  /*
   * Create a new note
   * @param createNoteDto Data for creating a note
   * @param req Request object 
   */
  @Post(':courseId/')
  async createNote(
    @Param('courseId') courseId: string,
    @Req() req: Request,
    @Body() createNoteDto: CreateNoteDto
  ) {
    return this.notesService.create(courseId, createNoteDto.content, req.user?.id);
  }


  @Get()
  async findAllNotes(@Req() req: Request) {
    const userId = req.user?.id;
    const notes = await this.notesService.findAll(userId);
    return { notes };
  }

  /*
   * Retrieve a specific note by ID
   * @param noteId ID of the note to retrieve
   * @param req Request object
   */
  @Get(':id')
  async findNoteById(@Param('id') noteId: string, @Req() req: Request) {
    const userId = req.user?.id;
    const note = await this.notesService.findById(noteId, userId);
    if (!note) {
      return { message: 'Note not found' };
    }
    return { note };
  }

  /*
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
    const userId = req.user?.id;
    const updatedNote = await this.notesService.update(noteId, userId, updateNoteDto);
    return { message: 'Note updated successfully', note: updatedNote };
  }

  /*
   * Delete a note by ID
   * @param noteId ID of the note to delete
   * @param req Request object
   */
  @Delete(':id')
  async deleteNote(@Param('id') noteId: string, @Req() req: Request) {
    const userId = req.user?.id;
    const deleted = await this.notesService.delete(noteId, userId);
    if (!deleted) {
      return { message: 'Note not found or not authorized to delete' };
    }
    return { message: 'Note deleted successfully' };
  }
}
