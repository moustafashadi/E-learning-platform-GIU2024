import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { ChatService } from './chat.service';
import { GetChatsDto } from './dto/get-chat.dto';
import { SearchChatsDto } from './dto/search-chats.dto';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Request } from 'express';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';


@UseGuards(AuthenticationGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getChats(getChatsDto: GetChatsDto) {
    return this.chatService.getChats(getChatsDto);
  }

  @Get(':id')
  getChat(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getChat(id);
  }

  @Get('search')
  searchChats(@Query() searchChats: SearchChatsDto) {
    return this.chatService.searchChats(searchChats);
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Post()
  createChat(@Req() req : Request,  @Body() createChatDto: CreateChatDto) {
    const userId = req.user['sub'];
    return this.chatService.createChat(createChatDto, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Put(':id')
  updateChat(
    @Req() req : Request,
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    const userId = req.user['sub'];
    return this.chatService.updateChat(id, updateChatDto, userId);
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Delete(':id')
  deleteChat(
    @Req() req : Request,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const userId = req.user['sub'];
    return this.chatService.deleteChat(id, userId);
  }
}