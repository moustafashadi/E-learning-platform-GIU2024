import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { QuestionService } from '../services/question.service';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { ResponseGateway } from 'src/response/gateway/response.gateway';
import { ResponseService } from 'src/response/services/response.service';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../models/quiz.schema';

@UseGuards(AuthenticationGuard)
@Controller('/:quizId')
export class QuestionController {
    constructor(private readonly questionService: QuestionService,
        private readonly responseGateway: ResponseGateway,
        private readonly responseService: ResponseService,
        private readonly quizService: QuizService
    ) {}
    
    @UseGuards(AuthorizationGuard)
    @Roles(Role.Instructor)
    @Post('/createQuestion')
    async createQuestion(@Param('quizId') quizId : string, @Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.createQuestion(quizId, createQuestionDto);
    }
    
    @Get('/questions')
    async getQuestions(@Param('quizId') quizId: string) {
        return this.questionService.getQuestions(quizId);
    }
    
    @Get(':id')
    async getQuestion(@Param('id') id: string) {
        return this.questionService.getQuestionById(id);
    }
    
    @UseGuards(AuthorizationGuard)
    @Roles(Role.Instructor)
    @Put(':id')
    async updateQuestion(
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ) {
        return this.questionService.updateQuestion(id, updateQuestionDto);
    }
    
    @UseGuards(AuthorizationGuard)
    @Roles(Role.Instructor)
    @Delete(':id')
    async deleteQuestion(@Param('id') id: string) {
        return this.questionService.deleteQuestion(id);
    }

    @Post('submit')
    async submitAnswer(@Param('quizId') quizId: string, @Body() { userId, questionId, chosenAnswer }: { userId: string; questionId: string; chosenAnswer: string }) {
        const savedResponse = await this.responseService.evaluateResponse(userId, questionId, chosenAnswer);

        // After evaluation, send real-time feedback
        this.responseGateway.sendResponseToClient(userId, {
            questionId: savedResponse.questionId,
            isCorrect: await this.questionService.isCorrect(questionId, chosenAnswer),
            feedbackMessage: savedResponse.feedbackMessage,
        });

        const quizDone = await this.quizService.checkIfAllQuestionsSolved(quizId);
        if (quizDone) {
            // Mark the quiz as done
            const quizDone = true;
            
        } else {
            //get next question
            const nextQuestion = await this.questionService.getNextQuestion(quizId);
        }

        // Optionally return an immediate HTTP response as well
        return { status: 'ok' };
    }
}
