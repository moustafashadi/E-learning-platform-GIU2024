import { Controller, Get, Param } from '@nestjs/common';
import { QuizService } from 'src/quiz/services/quiz.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly quizService: QuizService) {}


  
}
