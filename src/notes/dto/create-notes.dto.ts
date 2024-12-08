import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  readonly courseId: string;

  @IsString()
  readonly content: string;

  @IsOptional()
  @IsBoolean()
  readonly isPinned?: boolean;

  @IsOptional() // Keep it optional if the client doesn’t send this
  @IsString()
  readonly userId?: string;
}
