import { IsString, IsEnum, IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';
import { Schema } from 'mongoose';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  course_code: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  //NUMBER OF QUIZZES
  @IsNotEmpty()
  @IsNumber()
  numOfQuizzes: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  @IsNotEmpty()
  difficulty: string;

  @IsMongoId({ each: true })
  instructor: Schema.Types.ObjectId;

}
