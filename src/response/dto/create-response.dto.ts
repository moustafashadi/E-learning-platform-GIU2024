import { IsMongoId, IsArray, IsObject, IsNumber, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateResponseDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  quizId: Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  answers: Array<object>;

  @IsNumber()
  @IsNotEmpty()
  score: number;
}