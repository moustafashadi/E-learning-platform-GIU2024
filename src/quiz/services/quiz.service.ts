import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { Quiz } from '../models/quiz.schema';
import { Instructor, Student } from '../../user/models/user.schema';
import { Course } from '../../course/models/course.schema';
import { NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { QuestionService } from './question.service';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Instructor.name) private readonly instructorModel: Model<Instructor>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @Inject(QuestionService) private readonly questionService: QuestionService,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
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
  
  //getQuiz
  async getQuiz(quizId: string) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async getStudentQuizResults(quizId: string, studentId: string) {

    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const quizGrade = student.quizGrades.get(quizId as unknown as ObjectId);
    if (!quizGrade) {
      throw new NotFoundException('Quiz grade not found');
    }
    return quizGrade;
  }

  //check if all questions in the array of questions are solved, if so then return true
  async checkIfAllQuestionsSolved(quizId: string): Promise<boolean> {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    await quiz.populate({
      path: 'questions',
      model: 'Question', // replace 'Question' with the actual model name if different
    });
    const questions = await this.questionService.getQuestions(quizId);
    for (const question of questions) {
      if (!question.solved) {
        return false;
      }
    }
    return true;
  }
}
