import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { Quiz } from '../models/quiz.schema';
import { Instructor } from '../../user/models/user.schema';
import { Course } from '../../course/models/course.schema';
import { NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Instructor.name) private readonly instructorModel: Model<Instructor>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
  ) {}

  //TESTED - WORKING
  async createQuiz(userId: string, courseId: string) {
    const instructor = await this.instructorModel.findById(userId);
    const instructorId = instructor._id.toString();
    const course = await this.courseModel.findById(courseId);
    if (!instructor || !course) {
      throw new NotFoundException('Instructor or course not found');
    }
    if (!(instructorId === course.instructor.toString())) {
      throw new ConflictException('Instructor is not teaching this course');
    }

    const quiz = {
      course: new Types.ObjectId(courseId),
      questions: [],
    };
    const createdQuiz = new this.quizModel(quiz);

    // Add the quiz to the course
    course.quizzes.push(createdQuiz._id as any);
    await course.save();

    await createdQuiz.save();
    return createdQuiz;
  }
  async getStudentQuizResults(courseId: string, studentId: string) {
    const quizzes = await this.quizModel.find({
      course: courseId,
      'results.userId': studentId,
    });
    const quizResults = quizzes.map((quiz) => {
      const result = quiz.results.find((result) => result.userId === studentId);
      return {
        quizId: quiz._id,
        grade: result?.score,
      };
    });
    return {
      numQuizzes: quizResults.length,
      quizResults,
    };
  }
}
