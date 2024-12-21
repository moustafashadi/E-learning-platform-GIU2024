import { Get, Body, Controller, Param, Post, Put, UseGuards, Delete, Req, UsePipes, ValidationPipe } from '@nestjs/common'; // Add this import statement
import { Request } from 'express'; // Add this import statement
import { QuestionService } from '../services/question.service';
import { ResponseGateway } from 'src/response/gateway/response.gateway';
import { ResponseService } from 'src/response/services/response.service';
import { QuizService } from '../services/quiz.service';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Student, StudentDocument } from 'src/user/models/user.schema';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { Types, ObjectId } from 'mongoose';
import { QuizDocument } from '../models/quiz.schema';


@UseGuards(AuthenticationGuard)
@Controller('/:quizId')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly responseGateway: ResponseGateway,
    private readonly quizService: QuizService,
    private readonly responseService: ResponseService,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
    @InjectModel('Quiz') private readonly quizModal: Model<QuizDocument>,
  ) { }

  //TESTED-WORKING
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Post('/createQuestion')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createQuestion(
    @Param('quizId') quizId: string,
    @Body() { content, correctAnswer, difficulty }: { content: string, correctAnswer: string, difficulty: string }) {
    return this.questionService.createQuestion(quizId, content, correctAnswer, difficulty);
  }

  //TESTED-WORKING
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

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Student)
  @Post('/:id/submit')
  async submitAnswer(
    @Req() req: Request,
    @Param('id') questionId: string,
    @Body() { chosenAnswer }: { chosenAnswer: string },
  ) {
    const question = await this.questionService.getQuestionById(questionId);

    const userId = req.user['sub'];
    const student = await this.studentModel.findById(userId);
    if (!student.questionsSolved) {
      student.questionsSolved = [];
    }
    const quizId = await this.quizModal.findById(question.quiz);
    const parsedQuizId = quizId._id.toString();

    student.questionsSolved.push(questionId);
    const savedResponse = await this.responseService.evaluateResponse(userId, parsedQuizId, questionId, chosenAnswer);

    // After evaluation, send real-time feedback
    this.responseGateway.sendResponseToClient(userId, {
      questionId: savedResponse.questionId,
      isCorrect: await this.questionService.isCorrect(questionId, chosenAnswer),
      feedbackMessage: savedResponse.feedbackMessage,
    });

    const quizDone = await this.quizService.checkIfAllQuestionsSolved(req, parsedQuizId);
    if (quizDone) {
      // Calculate the grade
      const responses = await this.responseService.getResponsesForQuiz(userId, parsedQuizId);
      const correctAnswers = responses.filter(response => response.isCorrect).length;
      const totalQuestions = responses.length;
      const grade = (correctAnswers / totalQuestions) * 100;

      // Push the grade to the quizGrades attribute in the student schema
      student.quizGrades.set(parsedQuizId, grade);
      await student.save();
    } else {
      // Get next question
      const nextQuestion = await this.questionService.getNextQuestion(req, parsedQuizId);
    }

    // Optionally return an immediate HTTP response as well
    return { status: 'ok' };
  }
}