import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { MessageService } from './message.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';

@Controller('messages')
@UseGuards(AuthenticationGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatId')
  getMessages(@Param('chatId') chatId: string) {
    return this.messageService.getMessages(chatId);
  }

  @Post()
  createMessages(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
  }
}