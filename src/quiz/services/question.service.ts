import { Injectable } from '@nestjs/common';
import { Question } from '../models/question.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class QuestionService {
    constructor(
        @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    ) {}
    
    //get question by id function implementation
    async getQuestionById(questionId: string): Promise<Question> {
        return this.questionModel.findById(questionId);
    }

    //is correct function implementation
    async isCorrect(questionId: string, chosenAnswer: string): Promise<boolean> {
        const question = await this.questionModel.findById(questionId);
        return question.correctAnswer === chosenAnswer;
    }
}