import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
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
    //instructor ID taken from request (has to be currently logged in)
    const instructor = await this.instructorModel.findById(userId);
    const instructorId = instructor._id.toString();
    //course ID taken from params
    const course = await this.courseModel.findById(courseId);
    // Check if the instructor and course exist
    if (!instructor || !course) {
      throw new NotFoundException('Instructor or course not found');
    }
    // Check if the instructor is teaching the course
    if (!(instructorId === course.instructor.toString())) {
      throw new ConflictException('Instructor is not teaching this course');
    }
    const quiz = {
      course: courseId,
      questions: [],
    };
    const createdQuiz = new this.quizModel(quiz);

    const createdQuizId = new mongoose.Schema.ObjectId(createdQuiz._id.toString());
    // Add the quiz to the course
    course.quizzes.push(createdQuizId);
    
    await createdQuiz.save();
    return createdQuiz;
  }
  async getStudentQuizResults(courseId: string, studentId: string) {
    const quizzes = await this.quizModel.find({
      courseId,
      'results.userId': studentId,
    });
    const quizResults = quizzes.map((quiz) => {
      const result = quiz.results.find((result) => result.userId === studentId);      return {
        quizId: quiz._id,
        grade: result.score,
      };
    });
    return {
      numQuizzes: quizResults.length,
      quizResults,
    };
  }
}
