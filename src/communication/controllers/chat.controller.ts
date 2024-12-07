import { Controller, UseGuards, Body, Post, Req } from "@nestjs/common";
import { Request } from 'express';
import { AuthenticationGuard } from "src/auth/guards/authentication.guard";
import { CreateChatDto } from "../dto/create-chat.dto";
import { chatService } from "../services/chat.service";


@UseGuards(AuthenticationGuard)
@Controller('chats')
export class ChatController {
    constructor(
        private readonly chatService: chatService
    ) {}

    @Post()
    createChat(@Req() req: Request) {
        return this.chatService.create(req);
    }
}