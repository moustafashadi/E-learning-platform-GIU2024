import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { Quiz } from '../models/quiz.schema';
import { Instructor, Student } from '../../user/models/user.schema';
import { Course } from '../../course/models/course.schema';
import { NotFoundException, ConflictException, Inject, Req, BadRequestException, Body } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Request } from 'express';
import { Question } from '../models/question.schema';
import { ProgressService } from 'src/progress/services/progress.service';
import { NotificationGateway } from 'src/communication/notifications/notification.gateway';


@Injectable()
export class QuizService {
  constructor(
    private questionService: QuestionService,
    private progressService: ProgressService,
    private notificationGateway: NotificationGateway,
    @InjectModel(Instructor.name) private readonly instructorModel: Model<Instructor>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) { }

  //TESTED - WORKING
  async createQuiz(@Body() title: string, userId: string, courseId: string) {

    const instructor = await this.instructorModel.findById(userId);
    const instructorId = instructor._id.toString();

    const course = await this.courseModel.findById(courseId);

    if (course.quizzes.length == course.numOfQuizzes){
      throw new BadRequestException('The number of quizzes for this course has been reached, update the course to add more quizzes');
    }

    if (!instructor || !course) {
      throw new NotFoundException('Instructor or course not found');
    }
    if (!(instructorId === course.instructor.toString())) {
      throw new ConflictException('Instructor is not teaching this course');
    }

    const quiz = {
      title : title,
      course: new Types.ObjectId(courseId),
      //INSTRUCTOR
      instructor: new Types.ObjectId(userId),
    };
    const createdQuiz = new this.quizModel(quiz);

    // Add the quiz to the course
    course.quizzes.push(createdQuiz._id as any);
    await course.save();

    await createdQuiz.save();

    await this.notificationGateway.sendQuizNotification(course, createdQuiz._id.toString());

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
    const studentCourseQuizGrades = studentCourseQuizzesIds.map((quizId) => student.quizGrades.get(quizId));

    return studentCourseQuizGrades;

  }

  //check if all questions in the array of questions are solved, if so then return true
  async checkIfAllQuestionsSolved(req: Request, quizId: string): Promise<boolean> {
    console.log(8);
    const studentId = req.user['sub'];
    console.log('quizId', quizId);
    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    if (!student.questionsSolved) {
      student.questionsSolved = [];
    }
    const quiz = await this.quizModel.findById(quizId);
    const course = await this.courseModel.findById(quiz.course);
    const courseId = course._id.toString();

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const questions = quiz.questions;
    let questionIds = [];

    for (const question of questions) {
      questionIds = student.questionsSolved.map((questionId) => questionId.toString());
    }

    for (const question of questionIds) {
      // Check if the question's _id is not in the questionsSolved map
      if (!student.questionsSolved.includes(question)) {
        return false;
      }
    }

  
    await this.progressService.updateProgress(studentId, courseId);
    return true;
  }

  //delete quiz
  async deleteQuiz(quizId: string) {
    try {
      const quiz = await this.quizModel.findById(quizId).exec();

      if (!quiz) {
        throw new NotFoundException('Quiz not found');
      }

      //remove the quiz from the course
      const CourseId = quiz.course;
      const course = await this.courseModel.findById(CourseId).exec();
      const quizzes = course.quizzes;
      await this.courseModel.findByIdAndUpdate(CourseId, { quizzes: quizzes.filter((quiz) => quiz.toString() !== quizId) }).exec();

      console.log('quiz removed from course', course._id)

      //delete all questions in this quiz
      const questions = quiz.questions;
      await this.questionService.deleteQuestions(questions);

      console.log('questions deleted');

      //remove the quiz from the quizGrades attribute of all students
      //GET ONLY THE STUDENTS THAT ARE ENROLLED IN THE COURSE. BE EFFICIENT FFS
      const students = await this.studentModel.find({ enrolledCourses: CourseId }).exec();
      for (const student of students) {
        const parsedQuizId = quizId.toString();
        student.quizGrades.delete(parsedQuizId);
        await student.save();
      }
      console.log('quiz removed from students');

      await this.quizModel.findByIdAndDelete(quizId).exec();
      console.log('quiz deleted');
      return HttpStatus.OK;
    } catch (error) {
      throw new BadRequestException('Error deleting quiz');
    }
  }

  //used in course service to delete all quizzes in a course when the course is deleted
  async deleteQuizzes(quizzes: ObjectId[]) {
    try {
      for (const quizId of quizzes) {
        //delete all questions in this quiz
        const quiz = await this.quizModel.findById(quizId).exec();
        const questions = quiz.questions;
        await this.questionService.deleteQuestions(questions);

        //delete the quiz in the quizGrades attribute of all students
        const students = await this.studentModel.find().exec();
        for (const student of students) {
          const parsedQuizId = quizId.toString();
          student.quizGrades.delete(parsedQuizId);
          await student.save();
        }

        await this.quizModel.findByIdAndDelete(quizId).exec();
      }
    } catch (error) {
      throw new BadRequestException('Error deleting quizzes');
    }
  }
}
