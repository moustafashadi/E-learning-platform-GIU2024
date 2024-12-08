import { Injectable } from '@nestjs/common';
import { Question } from '../models/question.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class QuestionService {
    constructor(
        @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    ) {}

    async createQuestion(createQuestionDto: any): Promise<Question> {
        return this.questionModel.create(createQuestionDto);
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
}