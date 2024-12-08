import { Controller, Post, Body, Req } from '@nestjs/common';
import { ResponseService } from '../../response/services/response.service';
import { ResponseGateway } from '../../response/gateway/response.gateway';

@Controller('quiz')
export class QuizController {
    constructor(
        private readonly responseService: ResponseService,
        private readonly responseGateway: ResponseGateway,
    ) { }

    @Post('submit')
    async submitAnswer(@Body() { userId, questionId, chosenAnswer }: { userId: string; questionId: string; chosenAnswer: string }) {
        const savedResponse = await this.responseService.evaluateResponse(userId, questionId, chosenAnswer);

        // After evaluation, send real-time feedback
        this.responseGateway.sendResponseToClient(userId, {
            questionId: savedResponse.questionId,
            isCorrect: savedResponse.isCorrect,
            feedbackMessage: savedResponse.feedbackMessage,
        });

        // Optionally return an immediate HTTP response as well
        return { status: 'ok' };
    }
}