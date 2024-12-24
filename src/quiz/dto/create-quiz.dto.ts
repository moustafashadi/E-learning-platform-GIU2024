import { IsMongoId, IsArray, IsNumber, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateQuizDto {
    @IsMongoId()
    @IsNotEmpty()
    module_id: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    course: Types.ObjectId;

    @IsArray()
    @IsMongoId({ each: true })
    questions: Types.ObjectId[];

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    number_of_questions: number;

    @IsNumber()
    quizGrade: number = 0;

    @IsEnum(['Multiple Choice', 'True/False', 'Mixed'])
    @IsNotEmpty()
    quiz_type: string;
}