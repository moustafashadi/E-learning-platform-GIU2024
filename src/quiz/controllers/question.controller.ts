import {
  Get,
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  Delete,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { QuestionService } from '../services/question.service';
import { ResponseGateway } from 'src/response/gateway/response.gateway';
import { ResponseService } from 'src/response/services/response.service';
import { QuizService } from '../services/quiz.service';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Student, StudentDocument } from 'src/user/models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthenticationGuard)
@Controller('quiz/:quizId')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly responseGateway: ResponseGateway,
    private readonly quizService: QuizService,
    private readonly responseService: ResponseService,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  /**
   * Instructor creates a question with or without 'options'.
   */
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Post('/createQuestion')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createQuestion(
    @Param('quizId') quizId: string,
    @Body()
    {
      content,
      correctAnswer,
      difficulty,
      options,
    }: {
      content: string;
      correctAnswer: string;
      difficulty: string;
      options?: { text: string; identifier: string }[];
    },
  ) {
    return this.questionService.createQuestion(
      quizId,
      content,
      correctAnswer,
      difficulty,
      options,
    );
  }

  /**
   * Instructor or admin wants to see all questions (with correct answers).
   */
  @Get('/questions')
  async getQuestions(@Param('quizId') quizId: string) {
    return this.questionService.getQuestions(quizId);
  }

  /**
   * Student: retrieve questions WITHOUT correctAnswer
   */
  @Get('/questions/student')
  async getQuestionsForStudent(@Param('quizId') quizId: string) {
    return this.questionService.getQuestionsForStudent(quizId);
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Put(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.updateQuestion(id, updateQuestionDto);
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Delete(':id')
  async deleteQuestion(@Param('id') id: string) {
    return this.questionService.deleteQuestion(id);
  }

  @Get(':id')
  async getQuestion(@Param('id') id: string) {
    return this.questionService.getQuestionById(id);
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Student)
  @Post('/:id/submit')
  async submitAnswer(
    @Req() req: Request,
    @Param('id') questionId: string,
    @Body() { chosenAnswer }: { chosenAnswer: string },
  ) {
    console.log(1);
    const question = await this.questionService.getQuestionById(questionId);
    console.log(2);
    const userId = req.user['sub'];
    const student = await this.studentModel.findById(userId);
    if (!student.questionsSolved) {
      student.questionsSolved = [];
    }
    console.log(3);
    const quizId = await this.quizService.getQuiz(question.quiz.toString());
    const parsedQuizId = quizId._id.toString();
    console.log(4);
    student.questionsSolved.push(questionId);
    const savedResponse = await this.responseService.evaluateResponse(
      userId,
      parsedQuizId,
      questionId,
      chosenAnswer,
    );
    console.log(5);
    // Real-time feedback
    this.responseGateway.sendResponseToClient(userId, {
      questionId: savedResponse.questionId,
      isCorrect: await this.questionService.isCorrect(questionId, chosenAnswer),
      feedbackMessage: savedResponse.feedbackMessage,
    });
    console.log(6);
    // Check if quiz is done
    const quizDone = await this.quizService.checkIfAllQuestionsSolved(req, parsedQuizId);
    console.log(7);
    if (quizDone) {
      // Calculate final grade


      const responses = await this.responseService.getResponsesForQuiz(
        userId,
        parsedQuizId,
      );
     
      const correctAnswers = responses.filter((r) => r.isCorrect).length;
      const totalQuestions = responses.length;
      const grade = (correctAnswers / totalQuestions) * 100;
      student.quizGrades.set(parsedQuizId, grade);
      await student.save();
    } else {
      // next question
      const nextQuestion = await this.questionService.getNextQuestion(req, parsedQuizId);
    }

    return { status: 'ok' };
  }
}
