import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "../models/chat.schema";
import { CreateChatDto } from "../dto/create-chat.dto";
import { request } from "http";
import { User, UserDocument } from "src/user/models/user.schema";
import { UserService } from "src/user/services/user.service";
import { Req } from "@nestjs/common";
import { Request } from "express";


export class chatService{
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        private userService: UserService,
    ){}

    async create(@Req() req: Request): Promise<Chat> {
        const creator = await this.userService.getCurrentUser(req);
        const createdChat = new this.chatModel({
            participants: [creator._id],
            messages: [],
            creator: creator._id,}
        );
        console.log(createdChat);
        return createdChat.save();
    }
}