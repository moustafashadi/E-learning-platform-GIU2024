import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { Quiz } from '../models/quiz.schema';
import { Instructor, Student } from '../../user/models/user.schema';
import { Course } from '../../course/models/course.schema';
import { NotFoundException, ConflictException, Inject, Req, BadRequestException } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Request } from 'express';
import { Question } from '../models/question.schema';


@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Instructor.name) private readonly instructorModel: Model<Instructor>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @Inject(QuestionService) private readonly questionService: QuestionService,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) { }

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



  async getStudentQuizResults(courseId: string, studentId: string) {
    const student = await this.studentModel.findById(studentId);
    console.log('student', student);

    const enrolledCourses = student.enrolledCourses;
    console.log('enrolledCourses', enrolledCourses);

    const stringifiedEnrolledCourses = enrolledCourses.map((course) => course.toString());

    if (!stringifiedEnrolledCourses.includes(courseId)) {
      throw new BadRequestException('Student is not enrolled in this course');
    }

    //course Quizzes
    const course = await this.courseModel.findById(courseId);
    const quizzes = course.quizzes;
    console.log('quizzes', quizzes);

    const stringifiedCourseQuizzes = quizzes.map((quiz) => quiz.toString());

    //student QuizResults  
    const studentQuizIds = Array.from(student.quizGrades.keys());
    const stringifiedStudentQuizIds = studentQuizIds.map((quizId) => quizId.toString());

    //get the quizzes of the student that are in the course
    const studentCourseQuizzesIds = stringifiedStudentQuizIds.filter((quizId) => stringifiedCourseQuizzes.includes(quizId));

    //filter the quizGrades attribute of the student to get the grades of the quizzes that are in the course
    const studentCourseQuizGrades = studentCourseQuizzesIds.map((quizId) => student.quizGrades.get(quizId as unknown as mongoose.Schema.Types.ObjectId));

    return studentCourseQuizGrades;

  }

  //check if all questions in the array of questions are solved, if so then return true
  async checkIfAllQuestionsSolved(req: Request, quizId: string): Promise<boolean> {
    const studentId = req.user['sub'];
    console.log('quizId', quizId);
    const student = await this.studentModel.findById(studentId);
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const questions: Question[] = quiz.questions as unknown as Question[];

    for (const question of questions) {
      // Check if the question's _id is not in the questionsSolved map
      if (!student.questionsSolved.has(question._id)) {
        return false;
      }
    }
    return true;
  }

}
