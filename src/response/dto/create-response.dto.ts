import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  chosenAnswer: string;
}
