import { Controller, Post, Get, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-notes.dto';
import { UpdateNoteDto } from '../dto/update-notes.dto';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';

@Controller('notes')
@UseGuards(AuthenticationGuard)  // Add this line to protect all routes
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  //create note for specific course
  @Post(':courseId')
async createNote(
  @Param('courseId') courseId: string,
  @Body() createNoteDto: { content: string },
  @Req() req: Request,
) {
  const userId = req.user['sub'];
  return this.notesService.createNoteForCourse(
    courseId,
    createNoteDto.content,
    userId
  );
}

  @Get('/findall')
  async findAllNotes(@Req() req: Request) {
    const userId = req.user['sub'];  
    const notes = await this.notesService.findAll(userId);
    return { notes };
  }

  @Get(':id')
  async findNoteById(@Param('id') noteId: string, @Req() req: Request) {
    const userId = req.user['sub'];  
    const note = await this.notesService.findById(noteId, userId);
    return { note };
  }

  @Put(':id')
  async updateNote(
    @Param('id') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: Request,
  ) {
    const userId = req.user['sub'];  // Get userId from JWT token
    const updatedNote = await this.notesService.update(noteId, userId, updateNoteDto);
    return { message: 'Note updated successfully', note: updatedNote };
  }

  @Delete(':id')
  async deleteNote(@Param('id') noteId: string, @Req() req: Request) {
    const userId = req.user['sub'];  // Get userId from JWT token
    await this.notesService.delete(noteId, userId);
    return { message: 'Note deleted successfully' };
  }
}