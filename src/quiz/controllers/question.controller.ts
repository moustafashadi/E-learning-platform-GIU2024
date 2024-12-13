// filepath: /f:/E-learning-platform-GIU2024/src/quiz/controllers/question.controller.ts
import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { ResponseGateway } from 'src/response/gateway/response.gateway';
import { ResponseService } from 'src/response/services/response.service';
import { QuizService } from '../services/quiz.service';
import { Student, StudentDocument } from 'src/user/models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';

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