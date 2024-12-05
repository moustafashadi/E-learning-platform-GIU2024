import { IsEmail, IsString, IsArray, MinLength } from 'class-validator';
import {Schema} from 'mongoose'

export class CreateStudentDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  role: string;

  @IsArray()
  enrolledCourses?: Schema.Types.ObjectId[];

  @IsArray()
  completedCourses?: Schema.Types.ObjectId[];
}