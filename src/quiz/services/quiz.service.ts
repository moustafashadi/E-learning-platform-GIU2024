import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from 'src/quiz/models/quiz.schema';
import { CreateQuizDto } from 'src/quiz/dto/create-quiz.dto';
import { UpdateQuizDto } from 'src/quiz/dto/update-quiz.dto';
import { QuestionService } from './question.service';

@Injectable()
export class QuizService {
  getAdaptiveQuestion(arg0: number): import("../models/question.schema").Question | PromiseLike<import("../models/question.schema").Question> {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    private readonly questionService: QuestionService
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const createdQuiz = new this.quizModel(createQuizDto);
    return createdQuiz.save();
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    return this.quizModel.findByIdAndUpdate(id, updateQuizDto, { new: true });
  }

  async getAdaptiveQuiz(userId: string) {
    const userPerformance = await this.getUserPerformance(userId);
    const difficulty = this.determineDifficulty(userPerformance);

    const questions = await this.questionService.getQuestionsByDifficulty(difficulty);
    return { questions, difficulty };
  }

  private async getUserPerformance(userId: string) {
    return { correctAnswers: 5, totalQuestions: 10 };
  }

  private determineDifficulty(userPerformance: any): string {
    const accuracy = userPerformance.correctAnswers / userPerformance.totalQuestions;
    if (accuracy >= 0.8) {
      return 'hard';
    } else if (accuracy >= 0.5) {
      return 'medium';
    } else {
      return 'easy';
    }
  }
}
