import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateQuizDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsOptional()
  questionIds?: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
