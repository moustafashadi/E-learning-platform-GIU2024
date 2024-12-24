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

  @IsMongoId()
  instructor: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  students?: MongooseSchema.Types.ObjectId[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  modules?: MongooseSchema.Types.ObjectId[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  forums?: MongooseSchema.Types.ObjectId[];

  @IsEnum(['Public', 'Private'])
  @IsNotEmpty()
  availability: string;

  @IsOptional()
  @IsNumber()
  rating?: number;
}