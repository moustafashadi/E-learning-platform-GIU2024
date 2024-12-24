import { IsString, IsNotEmpty, IsEnum, IsMongoId, IsArray, IsOptional, IsNumber } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsEnum(['Public', 'Private'])
  @IsNotEmpty()
  availability: string;

}