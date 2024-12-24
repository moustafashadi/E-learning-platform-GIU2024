import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { AuthenticationGuard } from '../../../auth/guards/authentication.guard';
import { MessageService } from '../message.service';
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Post()
  createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }


  @Get(':id')
  getChatById(@Param('id') id: string) {
    return this.chatService.getChatByUserId(id);
  }

  @Get()
  getUserChats(@Query('userId') userId: string) {
    return this.chatService.getChatByUserId(userId);
  }

  @Patch(':id/members')
  addMembers(
    @Param('id') id: string,
    @Body() { userIds }: { userIds: string[] }
  ) {
    return this.chatService.addMembers(id, userIds);
  }
  @Get('/:userId')
  getChatByUserId(@Param('userId') userId: string,) {
    return this.chatService.getChatByUserId(userId);
  }
}