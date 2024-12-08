import { Controller, UseGuards, Body, Post, Get, Param, Patch } from "@nestjs/common";
import { Request } from 'express';
import { AuthenticationGuard } from "src/auth/guards/authentication.guard";
import { CreateChatDto } from "../dto/create-chat.dto";
import { chatService } from "../services/chat.service";
import { Req } from "@nestjs/common";


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
    @Get('id')
    findOne(@Param('id') id: string) {
    return this.chatService.findChat(id);
  }
  @Post("addUser")
  createParticipant(userId:string,@Req() req:Request , chatId:string){
    return this.chatService.addParticipant(userId,req,chatId)
  }  
   @Patch()
   update(@Param('id') id: string, @Body() title: string) {
   return this.chatService.updateChatTitle(id, title);
  }
    
//     @Get(':id')
//     findOne(@Param('id') id: string) {
//     return this.chatService.findOne(id);
//   }

}