// src/communication/chat/message.controller.ts

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';

@Controller('messages')
@UseGuards(AuthenticationGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
  }

  @Get(':chatId')
  async getMessages(@Param('chatId') chatId: string) {
    return this.messageService.getMessages(chatId);
  }
}