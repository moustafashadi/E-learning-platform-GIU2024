import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, ResponseDocument } from './models/response.schema';
import { Model } from 'mongoose';
import { QuestionService } from '../question/question.service'; // Hypothetical service to fetch question details

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
    private questionService: QuestionService,
  ) {}

  async evaluateResponse(userId: string, questionId: string, chosenAnswer: string): Promise<Response> {
    // Fetch the correct answer for the question
    const question = await this.questionService.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    const isCorrect = question.correctAnswer === chosenAnswer;
    const feedbackMessage = isCorrect
      ? 'Correct! Great job.'
      : `Incorrect. Hint: ${question.hint || 'Review the related material for more understanding.'}`;

    const response = new this.responseModel({
      userId,
      questionId,
      chosenAnswer,
      isCorrect,
      feedbackMessage,
    });

    return response.save();
  }
}
