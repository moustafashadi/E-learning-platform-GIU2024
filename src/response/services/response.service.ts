import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response, ResponseDocument } from '../models/response.schema';
import { Model } from 'mongoose';
import { QuestionService } from '../../quiz/services/question.service';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
    private questionService: QuestionService,
  ) {}

  async evaluateResponse(userId: string, quizId: string, questionId: string, chosenAnswer: string): Promise<Response> {
    const question = await this.questionService.getQuestionById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    const isCorrect = question.correctAnswer === chosenAnswer;
    const feedbackMessage = isCorrect
      ? 'Correct! Great job.'
      : `Incorrect.'Review the related material for more understanding.`;

    const response = new this.responseModel({
      userId,
      quizId,
      questionId,
      chosenAnswer,
      isCorrect,
      feedbackMessage,
    });

    return response.save();
  }

  async getResponsesForQuiz(userId: string, quizId: string): Promise<Response[]> {
    return this.responseModel.find({ userId, quizId }).exec();
  }
}