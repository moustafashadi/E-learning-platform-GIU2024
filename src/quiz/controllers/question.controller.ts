import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { QuestionService } from 'src/quiz/services/question.service';
import { CreateQuestionDto } from 'src/quiz/dto/create-question.dto'; 
import { UpdateQuestionDto } from 'src/quiz/dto/update-question.dto';


@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(id, updateQuestionDto);
  }
}
