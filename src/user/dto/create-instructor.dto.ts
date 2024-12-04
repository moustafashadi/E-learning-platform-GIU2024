import { IsEmail, IsString, IsArray, MinLength, IsOptional } from 'class-validator';
import {Schema} from 'mongoose'

export class createInstructorDto {
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
  coursesTaught: Schema.Types.ObjectId[];
}