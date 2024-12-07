import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  module_code: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resources?: string[]; // Optional array of resource URLs

  @IsArray()
  @IsMongoId({ each: true })
  courses: string[]; // Array of Course IDs to associate with this module
}
