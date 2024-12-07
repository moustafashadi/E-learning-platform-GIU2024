import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateProgressDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionPercentage: number;
}
