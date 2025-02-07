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

  async sendResponse(studentId: string, quizId: string, percentage : number): Promise<Response> {
    
    const feedbackMessage = percentage < 60 ? 'You failed the quiz' : 'You passed the quiz';

    const response = new this.responseModel({
      studentId,
      quizId,
      feedbackMessage,
    });

    response.save();

    return response;
  }

  async getResponsesForQuiz(userId: string, quizId: string): Promise<Response[]> {
    return this.responseModel.find({ userId, quizId }).exec();
  }
}