import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Question } from '../models/question.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from '../models/quiz.schema';
import { Student } from 'src/user/models/user.schema';
import { Request } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {}

  /**
   * Create a question with text, correct answer (A/B/C/D),
   * difficulty, and an array of 'options'.
   */
  async createQuestion(
    quizId: string,
    content: string,
    correctAnswer: string,
    difficulty: string,
    options?: { text: string; identifier: string }[], // optional
  ): Promise<Question> {
    try {
      const quiz = await this.quizModel.findById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const index = quiz.questions.length + 1;
      const finalOptions = options || [];

      const createdQuestion = await this.questionModel.create({
        quiz: new Types.ObjectId(quizId),
        content,
        correctAnswer,
        difficulty,
        index,
        options: finalOptions,
      });

      quiz.questions.push(createdQuestion._id as any);
      await quiz.save();

      return createdQuestion;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Error creating question');
    }
  }

  async getQuestionById(questionId: string): Promise<Question> {
    return this.questionModel.findById(questionId);
  }

  /**
   * Returns all questions for an instructor or admin.
   * Includes correctAnswer and full data.
   */
  async getQuestions(quizId: string): Promise<Question[]> {
    return this.questionModel.find({ quiz: quizId });
  }

  /**
   * Returns all questions for a student
   * WITHOUT revealing correctAnswer.
   */
  async getQuestionsForStudent(quizId: string) {
    const questions = await this.questionModel
      .find({ quiz: quizId })
      .select('-correctAnswer'); 
      // or do logic that sets correctAnswer = undefined

    // Alternatively, we could map them to remove the field:
    // return questions.map(q => ({
    //    _id: q._id,
    //    content: q.content,
    //    options: q.options,
    //    // no correctAnswer
    // }));
    return questions;
  }

  async updateQuestion(questionId: string, updateQuestionDto: any): Promise<Question> {
    return this.questionModel.findByIdAndUpdate(questionId, updateQuestionDto, { new: true });
  }

  async isCorrect(questionId: string, chosenAnswer: string): Promise<boolean> {
    const question = await this.questionModel.findById(questionId);
    return question.correctAnswer === chosenAnswer;
  }

  // async getNextQuestion(req: Request, quizId: string): Promise<Question> {
  //   try {
  //     const quiz = await this.quizModel.findById(quizId);
  //     const questions = await this.questionModel.find({ _id: { $in: quiz.questions } });

  //     const userId = req.user['sub'];
  //     const student = await this.studentModel.findById(userId);

  //     const unsolved = questions.filter(
  //       (q) => !student.questionsSolved.includes(q._id as any),
  //     );
  //     if (unsolved.length === 0) {
  //       return null;
  //     }
  //     return unsolved[0];
  //   } catch (error) {
  //     console.log(error.message);
  //     throw new InternalServerErrorException('Error getting next question');
  //   }
  // }

  async deleteQuestion(questionId: string): Promise<Question> {
    return this.questionModel.findByIdAndDelete(questionId);
  }

  // async deleteQuestions(questions: ObjectId[]) {
  //   try {
  //     for (const questionId of questions) {
  //       const question = await this.questionModel.findById(questionId);
  //       const quizId = question.quiz;
  //       const quiz = await this.quizModel.findById(quizId);
  //       const courseId = quiz.course;
  //       const students = await this.studentModel.find({ enrolledCourses: courseId });

  //       for (const student of students) {
  //         student.questionsSolved = student.questionsSolved.filter(
  //           (qId) => qId.toString() !== questionId.toString(),
  //         );
  //         await student.save();
  //       }
  //       await this.questionModel.findByIdAndDelete(questionId).exec();
  //     }
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error deleting questions');
  //   }
  // }
}
