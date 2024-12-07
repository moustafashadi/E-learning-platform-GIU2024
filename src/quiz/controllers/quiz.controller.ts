import { NotFoundException } from '@nestjs/common';
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { QuizService } from 'src/quiz/services/quiz.service'; 
import { Question } from 'src/quiz/models/question.schema'; 

@Controller('quiz')
export class QuizController {
    userModel: any;
    questionModel: any;
  constructor(private readonly quizService: QuizService) {}

  @Get('adaptive-question')
  async getAdaptiveQuestion(@Query('performance') performance: number): Promise<Question> {
    return this.quizService.getAdaptiveQuestion(Number(performance));
  }

  @Post('submit-answer')
async submitAnswer(
  @Body() { questionId, selectedAnswer, userId }: { questionId: string; selectedAnswer: string; userId: string },
): Promise<{ correct: boolean; newPerformance: number }> {
  const question = await this.questionModel.findById(questionId).exec();

  if (!question) {
    throw new NotFoundException('Question not found');
  }

  const isCorrect = question.correctAnswer === selectedAnswer;

  let userPerformance = await this.getUserPerformance(userId);

 
  if (isCorrect) {
    userPerformance = Math.min(userPerformance + 10, 100); // Cap performance at 100
  } else {
    userPerformance = Math.max(userPerformance - 10, 0); // Floor performance at 0
  }


  await this.updateUserPerformance(userId, userPerformance);

  return { correct: isCorrect, newPerformance: userPerformance };
}


private async getUserPerformance(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.performance || 50; // Default to 50 if not set
}

private async updateUserPerformance(userId: string, newPerformance: number): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    user.performance = newPerformance;
    await user.save();
    
    console.log(`User (${userId}) performance updated to: ${newPerformance}`);
  }
  

}
