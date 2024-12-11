import { Controller, Get, Param } from '@nestjs/common';
import { QuizService } from 'src/quiz/services/quiz.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly quizService: QuizService) {}

  @Get('student/:studentId/course/:courseId')
  async getStudentQuizResults(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    const quizResults = await this.quizService.getStudentQuizResults(
      courseId,
      studentId,
    );
    return quizResults;
  }
}
