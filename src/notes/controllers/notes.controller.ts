import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-notes.dto';
import { UpdateNoteDto } from '../dto/update-notes.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post(':courseId')
  async createNote(
    @Param('courseId') courseId: string,
    @Body() createNoteDto: { content: string },
  ) {
    const userId = "6754e537496f8484f98f3e03"; // Hardcoded user ID for testing
    return this.notesService.createNoteForCourse(
      courseId,
      createNoteDto.content,
      userId
    );
  }

  @Get()
  async findAllNotes() {
    const userId = "6754e537496f8484f98f3e03"; // Hardcoded user ID for testing
    const notes = await this.notesService.findAll(userId);
    return { notes };
  }

  @Get(':id')
  async findNoteById(@Param('id') noteId: string) {
    const userId = "6754e537496f8484f98f3e03"; // Hardcoded user ID for testing
    const note = await this.notesService.findById(noteId, userId);
    return { note };
  }

  @Put(':id')
  async updateNote(
    @Param('id') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const userId = "6754e537496f8484f98f3e03"; // Hardcoded user ID for testing
    const updatedNote = await this.notesService.update(noteId, userId, updateNoteDto);
    return { message: 'Note updated successfully', note: updatedNote };
  }

  @Delete(':id')
  async deleteNote(@Param('id') noteId: string) {
    const userId = "6754e537496f8484f98f3e03"; // Hardcoded user ID for testing
    await this.notesService.delete(noteId, userId);
    return { message: 'Note deleted successfully' };
  }
}