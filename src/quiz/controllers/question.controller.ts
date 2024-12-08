import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { QuestionService } from '../services/question.service';
import { UpdateQuestionDto } from '../dto/update-question.dto';

@Controller('/questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}
    
    @Post('/:quizId/createQuestion')
    async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.createQuestion(createQuestionDto);
    }
    
    @Get('/:quizId')
    async getQuestions() {
        return this.questionService.getQuestions();
    }
    
    @Get(':id')
    async getQuestion(@Param('id') id: string) {
        return this.questionService.getQuestionById(id);
    }
    
    @Put(':id')
    async updateQuestion(
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ) {
        return this.questionService.updateQuestion(id, updateQuestionDto);
    }
    
    @Delete(':id')
    async deleteQuestion(@Param('id') id: string) {
        return this.questionService.deleteQuestion(id);
    }
}
