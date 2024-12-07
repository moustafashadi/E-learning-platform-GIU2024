import { IsEmail, IsString, IsNumber, IsArray, IsEnum } from 'class-validator';
import { Course } from "../../course/models/course.schema";

export class RegisterRequestDto {
    @IsEmail()
    email: string;

   @IsString()
    password: string;

    @IsString()
    username: string;

    @IsEnum(['admin', 'student', 'instructor'])
    role: string = 'student';

}