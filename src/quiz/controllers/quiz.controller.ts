import { Controller, Post, Body, Req, UseGuards, Param, Get, Delete } from '@nestjs/common';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { QuizService } from '../services/quiz.service';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Question } from '../models/question.schema';
import { ResponseGateway } from 'src/response/gateway/response.gateway';
import { QuestionService } from '../services/question.service';
import { ResponseService } from 'src/response/services/response.service';
import { PerformanceMatrixService } from 'src/analytics/services/performanceMatrix.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';

@UseGuards(AuthenticationGuard)
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly questionService: QuestionService,
    private readonly responseGateway: ResponseGateway,
    private readonly quizService: QuizService,
    private readonly performanceMatrixService: PerformanceMatrixService,
  ) { }

  //create quiz
  @Post('/:moduleId')
  async createQuiz(
    @Body() createQuizDto : CreateQuizDto , // Extract `title` directly
    @Param('moduleId') moduleId : string,
  ) {
    return await this.quizService.createQuizBlueprint(moduleId ,createQuizDto);
  }

  //generate quiz
  @Post('/:moduleId/generate')
  async generateQuiz(@Param('moduleId') moduleId: string, @Req() req) {
    return await this.quizService.generateQuiz(moduleId, req);
  }


  //getQuiz by id
  @Get(':quizId')
  async getQuiz(@Param('quizId') quizId: string) {
    return this.quizService.getQuiz(quizId);
  }

  @Get('/:courseId/:studentId')
  async getStudentQuizResults(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    console.log('courseId', courseId);
    // const quizResults = await this.quizService.getStudentQuizResults(
    // courseId,
    // studentId,
    // );
    // return quizResults;
  }

}

