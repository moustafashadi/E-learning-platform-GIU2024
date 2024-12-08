import { Controller, Post, Get, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-notes.dto';
import { UpdateNoteDto } from '../dto/update-notes.dto';
import { UserService } from 'src/user/services/user.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService,
  private readonly userService: UserService
  ) {}

  @Post(':courseId')
  async createNote(
    @Param('courseId') courseId: string,
    @Req() req: Request,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    const user = await this.userService.getCurrentUser(req);
    console.log('User:', user);
    return this.notesService.createNoteForCourse(
      courseId,
      createNoteDto.content,
      user._id.toString(),
    );
  }

  @Get()
  async findAllNotes(
    @Req() req,
  ) {
    const notes = await this.notesService.findAll(req.user.sub);
    return { notes };
  }

  @Get(':id')
  async findNoteById(@Param('id') noteId: string , @Req() req) {
    const note = await this.notesService.findById(noteId, req.user.sub);
    return { note };
  }

  @Put(':id')
  async updateNote(
    @Param('id') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req,
  ) {
    const updatedNote = await this.notesService.update(noteId, req.user.sub , updateNoteDto);
    return { message: 'Note updated successfully', note: updatedNote };
  }

  @Delete(':id')
  async deleteNote(@Param('id') noteId: string, @Req() req) {
    await this.notesService.delete(noteId, req.user.sub);
    return { message: 'Note deleted successfully' };
  }
}