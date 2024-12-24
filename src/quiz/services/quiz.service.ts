import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { Module } from 'src/module/models/module.schema';


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
    @InjectModel(Module.name) private readonly moduleModel: Model<Module>,
  ) { }


  //used when module is created to set a blueprint for module quizzes
  // Used when module is created to set a blueprint for module quizzes
  async createQuizBlueprint(moduleId: string, createQuizDto: CreateQuizDto) {
    try {
      const module = await this.moduleModel.findById(moduleId);

      if (!module) {
        throw new InternalServerErrorException('Module not found');
      }

      // Store the quiz blueprint in the module
      module.quizBlueprint = {
        number_of_questions: createQuizDto.number_of_questions,
        quiz_type: createQuizDto.quiz_type,
        used: false,
      };

      await module.save();

      return module;
    } catch (error) {
      throw new InternalServerErrorException('Error creating quiz blueprint');
    }
  }

  //edit quiz blueprint if no student has taken the quiz
  async editQuizBlueprint(moduleId: string, createQuizDto: CreateQuizDto) {
    try {
      const module = await this.moduleModel.findById(moduleId);

      if (module.quizBlueprint.used) {
        throw new ConflictException('Quiz has already been taken by students');
      }

      module.quizBlueprint = {
        number_of_questions: createQuizDto.number_of_questions,
        quiz_type: createQuizDto.quiz_type,
        used: false,
      };

      await module.save();

    } catch (error) {
      throw new InternalServerErrorException('Error editing quiz blueprint');
    }
  }

  async generateQuiz(moduleId: string, req: Request) {
    try {
      const userId = req.user.id
      const module = await this.moduleModel.findById(moduleId);
      if (!module) {
        throw new NotFoundException('Module not found');
      }

      // Get the quiz blueprint from the module
      const quizBlueprint = module.quizBlueprint;
      const numberOfQuestions = quizBlueprint.number_of_questions;
      const quizType = quizBlueprint.quiz_type;

      quizBlueprint.used = true;

      await module.save();

      const userProgress = await this.progressService.getProgress(userId, moduleId);

      if (userProgress.level = 'Beginner') {
        // Get the questions from the module
        const questionIds = module.questions;

        let questions: Question[] = [];

        for (const Id of questionIds) {
          const questionArray = await this.questionService.getQuestions(Id.toString());
          questions = questions.concat(questionArray);
        }

        //filter the questions by difficulty
        const easyQuestions = questions.filter((question) => question.difficulty === 'Easy');

        //generate new quiz and add the questions till the number of questions is reached. select questions randomly
        let quizQuestions: Question[] = [];
        for (let i = 0; i < numberOfQuestions; i++) {
          const randomIndex = Math.floor(Math.random() * easyQuestions.length);
          quizQuestions.push(easyQuestions[randomIndex]);
        }

        // Create the quiz
        const quiz = new this.quizModel({
          questions: quizQuestions,
          moduleId: moduleId,
          type: quizType,
          status: 'in progress',
        });

        await quiz.save();
      } else if (userProgress.level = 'Intermediate') {
        // Get the questions from the module
        const questionIds = module.questions;

        let questions: Question[] = [];

        for (const Id of questionIds) {
          const questionArray = await this.questionService.getQuestions(Id.toString());
          questions = questions.concat(questionArray);
        }

        //filter the questions by difficulty
        const intermediateQuestions = questions.filter((question) => question.difficulty === 'Medium');

        //generate new quiz and add the questions till the number of questions is reached. select questions randomly
        let quizQuestions: Question[] = [];
        for (let i = 0; i < numberOfQuestions; i++) {
          const randomIndex = Math.floor(Math.random() * intermediateQuestions.length);
          quizQuestions.push(intermediateQuestions[randomIndex]);
        }

        // Create the quiz
        const quiz = new this.quizModel({
          questions: quizQuestions,
          moduleId: moduleId,
          type: quizType,
          status: 'in progress',
        });

        await quiz.save();
      } else if (userProgress.level === 'Advanced' || userProgress.level === 'Expert') {
        // Get the questions from the module
        const questionIds = module.questions;

        let questions: Question[] = [];

        for (const Id of questionIds) {
          const questionArray = await this.questionService.getQuestions(Id.toString());
          questions = questions.concat(questionArray);
        }

        //filter the questions by difficulty
        const advancedQuestions = questions.filter((question) => question.difficulty === 'Hard');

        //generate new quiz and add the questions till the number of questions is reached. select questions randomly
        let quizQuestions: Question[] = [];
        for (let i = 0; i < numberOfQuestions; i++) {
          const randomIndex = Math.floor(Math.random() * advancedQuestions.length);
          quizQuestions.push(advancedQuestions[randomIndex]);
        }

        // Create the quiz
        const quiz = new this.quizModel({
          questions: quizQuestions,
          moduleId: moduleId,
          type: quizType,
          status: 'in progress',
        });

        await quiz.save();
      }
    } catch (error) {
      throw new InternalServerErrorException('Error generating quiz');
    }
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
    const quiz = await this.quizModel.findById(quizId);
    const questionIds = quiz.questions;

    const stringifiedQuestionIds = questionIds.map((questionId) => questionId.toString());

    let grade = 0;

    const chosenAnswers = quiz.chosenAnswers;

    //check if questions are correct one by one
    for (let i = 0; i < stringifiedQuestionIds.length; i++) {
      const question = await this.questionService.getQuestionById(stringifiedQuestionIds[i]);

      if (question.correctAnswer === chosenAnswers[i]) {
        grade += 1;
      }
    }



    //   const enrolledCourses = student.enrolledCourses;
    //   console.log('enrolledCourses', enrolledCourses);

    //   const stringifiedEnrolledCourses = enrolledCourses.map((course) => course.toString());

    //   if (!stringifiedEnrolledCourses.includes(courseId)) {
    //     throw new BadRequestException('Student is not enrolled in this course');
    //   }

    //   //course Quizzes
    //   const course = await this.courseModel.findById(courseId);
    //   const quizzes = course.quizzes;
    //   console.log('quizzes', quizzes);

    //   const stringifiedCourseQuizzes = quizzes.map((quiz) => quiz.toString());

    //   //student QuizResults  
    //   const studentQuizIds = Array.from(student.quizGrades.keys());
    //   const stringifiedStudentQuizIds = studentQuizIds.map((quizId) => quizId.toString());

    //   //get the quizzes of the student that are in the course
    //   const studentCourseQuizzesIds = stringifiedStudentQuizIds.filter((quizId) => stringifiedCourseQuizzes.includes(quizId));

    //   //filter the quizGrades attribute of the student to get the grades of the quizzes that are in the course
    //   const studentCourseQuizGrades = studentCourseQuizzesIds.map((quizId) => student.quizGrades.get(quizId));

    //   return studentCourseQuizGrades;

  }

  // check if all questions in the array of questions are solved, if so then return true
  async isAllQuestionsSolved(quizId: string, answers: string[]): Promise<boolean> {
    try {
      const Quiz = await this.quizModel.findById(quizId)
      if (Quiz.questions.length > answers.length)
        return false;
      else if (answers.length > Quiz.questions.length)
        throw new InternalServerErrorException(`Where did you get the extra answers from`);
      else if (Quiz.questions.length === answers.length)
        return true;
    } catch (error) {
      throw new InternalServerErrorException("Error checking all questions are solved : ", error);
    }
  }


}
