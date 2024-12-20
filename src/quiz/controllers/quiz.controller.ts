import { Controller, Post, Body, Req, UseGuards, Param, Get } from '@nestjs/common';
import { ResponseService } from '../../response/services/response.service';
import { ResponseGateway } from '../../response/gateway/response.gateway';
import { QuestionService } from '../services/question.service';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { QuizService } from '../services/quiz.service';

@UseGuards(AuthenticationGuard)
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly questionService: QuestionService,
    private readonly responseGateway: ResponseGateway,
    private readonly quizService: QuizService,
  ) { }

  //create quiz
  @UseGuards(AuthenticationGuard)
  @Post('/:courseId')
  async createQuiz(
    @Req() req,
    @Param('courseId') courseId: string,) {
    return await this.quizService.createQuiz(req.user.sub, courseId);
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
    const quizResults = await this.quizService.getStudentQuizResults(
      courseId,
      studentId,
    );
    return quizResults;
  }

@Get('/course/:courseId')
async getQuizzesByCourseId(@Param('courseId') courseId: string) {
  return this.quizService.getQuizzesByCourseId(courseId);
}
}

