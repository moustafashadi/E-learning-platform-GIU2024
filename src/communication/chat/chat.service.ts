import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "./chat.schema";
import { UserService } from "src/user/services/user.service";
import { Body, NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";

export class chatService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        private userService: UserService,
    ) { }

    async create(@Req() req: Request): Promise<Chat> {
        const userId = req.user['sub'];
        const createdChat = new this.chatModel({
            title: req.body.title,
            participants: [userId],
            messages: [],
            creator: userId,
        }
        );
        console.log(createdChat);
        return createdChat.save();
    }

    async findChat(chatId: string): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId).exec();
        if (!chat)
            throw new NotFoundException(`Chat with this ID: ${chatId} is not found`);
        return chat;
    }

    async addParticipant(newUser: string, @Req() req: Request, chatId: string): Promise<Chat> {
        const newParticipant = await this.userService.findOne(newUser);
        if (!newParticipant) {
            throw new NotFoundException(`No such user wit this is id: ${newUser}`);
        }

        const existingChat = await this.findChat(chatId);
        if (!existingChat) {
            const newChat = await this.create(req);
            return new this.chatModel(newChat).save();
        }

        if (existingChat.participants.some((participant) => participant.toString() === newParticipant.id.toString())) {
            throw new Error('User is already a participant in this chat');
        }
        existingChat.participants.push(newParticipant.id);

        return (existingChat as ChatDocument).save();
    }
    
    async updateChatTitle(@Body() body, chatId: string): Promise<Chat> {
        const existingChat = await this.chatModel.findOne({ chatId });

        existingChat.title = body.message;
        return existingChat.save();
    }

    async createStudyGroups(@Req() req: Request, chatId: string, newUser: string): Promise<Chat> {
        const student = await this.userService.getCurrentUser(req);
        if (!student.role["Student"])
            throw new NotFoundException("You are not a student to create a study group")

        const createStudyGroup = new this.chatModel({
            participants: [student._id],
            messages: [],
            creator: student._id,
        }
        );


        const addUser = await this.userService.findOne(newUser);
        createStudyGroup.participants.push(addUser.id)
        return createStudyGroup.save();
    }
}