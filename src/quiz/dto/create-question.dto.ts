import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateQuestionDto {
  @IsMongoId()
  @IsNotEmpty()
  quiz: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string; // easy, medium, hard
}
