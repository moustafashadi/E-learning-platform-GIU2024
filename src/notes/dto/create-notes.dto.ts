import { IsString, IsBoolean, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNoteDto {
  @IsString()
  readonly courseId: Types.ObjectId;

  @IsString()
  readonly content: string;

  @IsOptional()
  @IsBoolean()
  readonly isPinned?: boolean;

  @IsOptional() // Keep it optional if the client doesn’t send this
  @IsString()
  readonly userId?: string;
}
