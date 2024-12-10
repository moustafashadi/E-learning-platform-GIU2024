import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-notes.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
// Inherits all fields from CreateNoteDto, but they are optional