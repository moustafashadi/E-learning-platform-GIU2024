//create update-question.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from '../dto/create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
