import { IsEmail, IsString, MinLength } from 'class-validator';
import {Schema} from 'mongoose'

export class CreateAdminDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  role: string;
}
