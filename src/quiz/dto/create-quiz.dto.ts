import { IsMongoId, IsArray, IsNumber, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateQuizDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    number_of_questions: number;

    @IsEnum(['Multiple Choice', 'True/False', 'Mixed'])
    @IsNotEmpty()
    quiz_type: string;
}