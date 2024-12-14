import { Get, Body, Controller, Param, Post, Put, UseGuards, Delete } from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { ResponseGateway } from 'src/response/gateway/response.gateway';
import { ResponseService } from 'src/response/services/response.service';
import { QuizService } from '../services/quiz.service';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Student, StudentDocument } from 'src/user/models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { CreateQuestionDto } from '../dto/create-question.dto';

@UseGuards(AuthenticationGuard)
@Controller('/:quizId')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly responseGateway: ResponseGateway,
    private readonly quizService: QuizService,
    private readonly responseService: ResponseService,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) { }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Post('/createQuestion')
  async createQuestion(@Param('quizId') quizId: string, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.createQuestion(quizId, createQuestionDto);
  }

  @Get('/questions')
  async getQuestions(@Param('quizId') quizId: string) {
    return this.questionService.getQuestions(quizId);
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

  @Post('submit')
  async submitAnswer(
    @Param('quizId') quizId: string,
    @Body() { userId, questionId, chosenAnswer }: { userId: string; questionId: string; chosenAnswer: string },
  ) {
    const savedResponse = await this.responseService.evaluateResponse(userId, quizId, questionId, chosenAnswer);

    // After evaluation, send real-time feedback
    this.responseGateway.sendResponseToClient(userId, {
      questionId: savedResponse.questionId,
      isCorrect: await this.questionService.isCorrect(questionId, chosenAnswer),
      feedbackMessage: savedResponse.feedbackMessage,
    });

    const quizDone = await this.quizService.checkIfAllQuestionsSolved(quizId);
    if (quizDone) {
      // Calculate the grade
      const responses = await this.responseService.getResponsesForQuiz(userId, quizId);
      const correctAnswers = responses.filter(response => response.isCorrect).length;
      const totalQuestions = responses.length;
      const grade = (correctAnswers / totalQuestions) * 100;

      // Push the grade to the quizGrades attribute in the student schema
      const student = await this.studentModel.findById(userId);
      student.quizGrades.set(quizId as any, grade);
      await student.save();
    } else {
      // Get next question
      const nextQuestion = await this.questionService.getNextQuestion(quizId);
    }

    // Optionally return an immediate HTTP response as well
    return { status: 'ok' };
  }
}