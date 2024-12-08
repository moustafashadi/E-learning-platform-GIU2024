import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    profilePicUrl?: string;
}
