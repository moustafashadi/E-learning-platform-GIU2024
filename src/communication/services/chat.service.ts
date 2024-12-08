import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "../models/chat.schema";
import { CreateChatDto } from "../dto/create-chat.dto";
import { request } from "http";
import { User, UserDocument } from "src/user/models/user.schema";
import { UserService } from "src/user/services/user.service";
import { NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";
import { messageDocument } from "../models/message.schema";
import { CreateStudentDto } from "src/user/dto/create-student.dto";
import { Student } from "src/user/models/user.schema";

export class chatService{
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        private userService: UserService,
    ){}

    async create(@Req() req: Request): Promise<Chat> {
        const creator = await this.userService.getCurrentUser(req);
        const createdChat = new this.chatModel({
            title:req.body.title,
            participants: [creator._id],
            messages: [],
            creator: creator._id,}
        );
        console.log(createdChat);
        return createdChat.save();
    }
    
    async findbyId(id:string):Promise<Chat>{
        return await this.chatModel.findById(id);
    }

    async findChat(chatId: string): Promise<Chat> {
        const chat = await this.chatModel.findById(chatId).exec();
        if (!chat) {
          throw new NotFoundException(`Chat with this ID: ${chatId} is not found`);
        }
        return chat.save();
      } 
      
    async addParticipant(newUser:string, @Req() req: Request,chatId:string):Promise<Chat>{
            const newParticipant= await this.userService.findOne(newUser);
            if(!newParticipant){
                throw new NotFoundException(`No such user wit this is id: ${newUser}`);
            }
            
            const existingChatt =await this.findChat(chatId);
            if(!existingChatt){
            const newChat = await this.create(req);
            return newChat.save()
        }

            if (existingChatt.participants.some((participant) => participant.toString() === newParticipant.id.toString())) {
            throw new Error('User is already a participant in this chat');
        }
            existingChatt.participants.push(newParticipant.id);

            return existingChatt; // msh 3aref a3ml .save()
 }
    async updateChatTitle(titlee:string,chatId:string):Promise<Chat>{
        const existingChat= await this.findChat(chatId);
        if(!existingChat)
            throw new NotFoundException(`No chat with this id ${chatId}`);

        existingChat.title=titlee;
        return  existingChat;// msh 3aref a3ml .save()
    }

    async createStudyGroups(@Req() req: Request,chatId:string,newUser:string): Promise<Chat> {
        const student =  await this.userService.getCurrentUser(req);
        if(!student.role["Student"])
            throw new NotFoundException("You are not a student to create a study group")
        
        const createStudyGroup = new this.chatModel({
            participants: [student._id],
            messages: [],
            creator: student._id,}
        );
       
        
        const addUser= await this.userService.findOne(newUser);
        createStudyGroup.participants.push(addUser.id)
        return createStudyGroup.save();
    }
}