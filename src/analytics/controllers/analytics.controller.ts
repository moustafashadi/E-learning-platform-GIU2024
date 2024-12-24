import { Controller, Get, Param } from '@nestjs/common';
import { QuizService } from 'src/quiz/services/quiz.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly quizService: QuizService) {}

  @Get(':courseId/:studentId/')
  async getStudentQuizResults(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    // const quizResults = await this.quizService.getStudentQuizResults(
    //   courseId,
    //   studentId,
    // );
    // return quizResults;
  }
}
