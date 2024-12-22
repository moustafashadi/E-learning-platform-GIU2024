import { Controller, Post, Body, Req, UseGuards, Param, Get, Delete } from '@nestjs/common';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { QuizService } from '../services/quiz.service';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Question } from '../models/question.schema';

@UseGuards(AuthenticationGuard)
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
  ) { }

  //create quiz
  @Post('/:courseId')
  async createQuiz(
    @Body('title') title: string, // Extract `title` directly
    @Req() req,
    @Param('courseId') courseId: string,
  ) {
    if (!title) {
      throw new Error('Quiz title is required');
    }
    return await this.quizService.createQuiz(title, req.user.sub, courseId);
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

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Delete('/:quizId')
  async deleteQuiz(
    @Param('quizId') quizId: string,
  ) {
    console.log('API called')
    return this.quizService.deleteQuiz(quizId);
  }
}
