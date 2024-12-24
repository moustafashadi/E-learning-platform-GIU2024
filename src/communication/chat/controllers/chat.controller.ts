import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { AuthenticationGuard } from '../../../auth/guards/authentication.guard';

@Controller('chat')
@UseGuards(AuthenticationGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @Post('message')
  addMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.addMessage(createMessageDto);
  }

  @Get(':id')
  getChat(@Param('id') id: string) {
    return this.chatService.getChat(id);
  }

  @Get()
  getUserChats(@Query('userId') userId: string) {
    return this.chatService.getUserChats(userId);
  }

  @Patch(':id/members')
  addMembers(
    @Param('id') id: string,
    @Body() { userIds }: { userIds: string[] }
  ) {
    return this.chatService.addMembers(id, userIds);
  }
}