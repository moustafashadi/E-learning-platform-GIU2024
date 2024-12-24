import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDocument } from './chat.model';
import { MessageDocument } from './message.model';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private chatModel: Model<ChatDocument>,
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    const chat = new this.chatModel(createChatDto);
    return await chat.save();
  }

  async addMessage(createMessageDto: CreateMessageDto) {
    const message = new this.messageModel(createMessageDto);
    const savedMessage = await message.save();
    
    await this.chatModel.findByIdAndUpdate(
      createMessageDto.chatId,
      { $push: { messages: savedMessage._id } }
    );
    
    return savedMessage;
  }

  async getChat(chatId: string) {
    return await this.chatModel
      .findById(chatId)
      .populate('users', 'username email profilePicUrl')
      .populate({
        path: 'messages',
        options: { sort: { timestamp: -1 } }
      });
  }

  async getUserChats(userId: string) {
    return await this.chatModel
      .find({ users: userId })
      .populate('users', 'username email profilePicUrl');
  }

  async addMembers(chatId: string, userIds: string[]) {
    return await this.chatModel.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: { $each: userIds } } },
      { new: true }
    );
  }
}