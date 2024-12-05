import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  course_code: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  @IsNotEmpty()
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  created_by: string; 
}
