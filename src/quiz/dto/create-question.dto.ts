import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  question: string;

  @IsArray()
  options: string[];

  @IsNumber()
  correctAnswerIndex: number;

  @IsString()
  @IsOptional()
  difficulty: string; // Difficulty: 'easy', 'medium', 'hard'
}
