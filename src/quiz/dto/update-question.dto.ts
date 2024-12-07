import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsNumber()
  @IsOptional()
  correctAnswerIndex?: number;

  @IsString()
  @IsOptional()
  difficulty?: string;
}
