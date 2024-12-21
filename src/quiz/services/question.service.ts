import { Injectable, InternalServerErrorException, Param, Req } from '@nestjs/common';
import { Question } from '../models/question.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { Quiz } from '../models/quiz.schema';
import { Student } from 'src/user/models/user.schema';
import { Request } from 'express';
import { Types } from 'mongoose';

export class QuestionService {
    constructor(
        @InjectModel(Question.name) private readonly questionModel: Model<Question>,
        @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
        @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    ) { }

    async createQuestion(quizId: string, content: string, correctAnswer: string, difficulty: string): Promise<Question> {
        try {
            const createdQuestion = await this.questionModel.create({ quiz: new Types.ObjectId(quizId), content, correctAnswer, difficulty });
            const quiz = await this.quizModel.findById(quizId);
            quiz.questions.push(createdQuestion._id as any);
            await quiz.save();
            return createdQuestion;
        } catch (error) {
            console.log(error.message);
        }
    }

    async getQuestionById(questionId: string): Promise<Question> {
        return this.questionModel.findById(questionId);
    }

    async getQuestions(quizId: string): Promise<Question[]> {
        //return the questions of a quiz
        return await this.questionModel.find({ quiz : quizId });
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


    async getNextQuestion(@Req() req: Request, quizId: string): Promise<Question> {
        try {
            const quiz = await this.quizModel.findById(quizId);
            const questions = await this.questionModel.find({ _id: { $in: quiz.questions } });

            const userId = req.user['sub'];
            const student = await this.studentModel.findById(userId);

            const unsolvedQuestions = questions.filter((question) => !student.questionsSolved.includes(question._id as any));
            if (unsolvedQuestions.length === 0) {
                return null;
            }
            return unsolvedQuestions[0];
        } catch (error) {
            console.log(error.message);
        }
    }

    //delete questions
    async deleteQuestions(questions: ObjectId[]) {
        try {
            for (const questionId of questions) {
                await this.questionModel.findByIdAndDelete(questionId).exec();
            }
        } catch (error) {
            throw new InternalServerErrorException('Error deleting questions');
        }
    }
}
