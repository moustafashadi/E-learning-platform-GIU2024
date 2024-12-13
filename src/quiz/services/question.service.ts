import { Injectable, Param } from '@nestjs/common';
import { Question } from '../models/question.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateQuestionDto } from '../dto/create-question.dto';

import { Quiz } from '../models/quiz.schema';

export class QuestionService {
    constructor(
        @InjectModel(Question.name) private readonly questionModel: Model<Question>,
        @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    ) {}

    async createQuestion(quizId : string , createQuestionDto: CreateQuestionDto): Promise<Question> {
        return this.questionModel.create({quiz: quizId, ...createQuestionDto});
    }
    
    async getQuestionById(questionId: string): Promise<Question> {
        return this.questionModel.findById(questionId);
    }
    
    async getQuestions(quizId: string): Promise<Question[]> {
        return this.questionModel.find({ quizId });
    }

    async updateQuestion(questionId: string, updateQuestionDto: any): Promise<Question> {
        return this.questionModel.findByIdAndUpdate(questionId, updateQuestionDto, { new: true });
    }

    async deleteQuestion(questionId: string): Promise<Question> {
        return this.questionModel.findByIdAndDelete(questionId);
    }

    async isCorrect(questionId: string, chosenAnswer: string): Promise<boolean> {
        const question = await this.questionModel.findById(questionId);
        return question.correctAnswer === chosenAnswer;
    }

    //getNextQuestion
    async getNextQuestion(quizId: string): Promise<Question> {
        const quiz = await this.quizModel.findById(quizId);
        const questions = await this.questionModel.find({ _id: { $in: quiz.questions } });
        const unsolvedQuestions = questions.filter((question) => !question.solved);
        if (unsolvedQuestions.length === 0) {
            return null;
        }
        return unsolvedQuestions[0];
    }
}
