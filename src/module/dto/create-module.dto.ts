import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsNumber } from 'class-validator';
import { Resource } from 'src/resources/resources.schema';
import { Types } from 'mongoose';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsArray()
  questions?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  resources?: Resource[];

  @IsNotEmpty()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  rating?: number[];
}