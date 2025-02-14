import { IsString, IsNotEmpty, IsMongoId, IsEnum, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Schema as MongooseSchema } from 'mongoose';

class OptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  identifier: string;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(['A', 'B', 'C', 'D'])
  @IsNotEmpty()
  correctAnswer: string;

  @IsEnum(['Easy', 'Medium', 'Hard'])
  @IsNotEmpty()
  difficulty: string;

  @IsEnum(['MCQ', 'True/False'])
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}