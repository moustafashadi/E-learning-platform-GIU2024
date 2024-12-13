import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterRequestDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(['admin', 'student', 'instructor'], { message: 'Invalid role' })
    role: string;
}