import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsArray()
  questionIds: string[]; // List of question IDs for the quiz

  @IsString()
  @IsOptional()
  description: string;
}
