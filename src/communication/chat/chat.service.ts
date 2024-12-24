import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async createChat(createChatDto: CreateChatDto): Promise<ChatDocument> {
    try {
      const chat = new this.chatModel({
        ...createChatDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return await chat.save();
    } catch (error) {
      throw new BadRequestException('Failed to create chat: ' + error.message);
    }
  }

  async getChatByUserId(userId: string): Promise<ChatDocument[]> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const chats = await this.chatModel
        .find({ users: userId })
        .populate('users', 'username email profilePicUrl')
        .populate({
          path: 'messages',
          populate: {
            path: 'senderId',
            select: 'username email profilePicUrl'
          },
          options: { sort: { timestamp: -1 } }
        })
        .sort({ updatedAt: -1 });

      if (!chats || chats.length === 0) {
        return [];
      }

      return chats;
    } catch (error) {
      throw new BadRequestException('Failed to get user chats: ' + error.message);
    }
  }

  async getUserChats(userId: string): Promise<ChatDocument[]> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      return await this.chatModel
        .find({ users: userId })
        .populate('users', 'username email profilePicUrl')
        .populate({
          path: 'messages',
          options: { 
            sort: { timestamp: -1 },
            limit: 1 // Only get the latest message for each chat
          },
          populate: {
            path: 'senderId',
            select: 'username email profilePicUrl'
          }
        })
        .sort({ updatedAt: -1 }); // Sort chats by most recent activity
    } catch (error) {
      throw new BadRequestException('Failed to get user chats: ' + error.message);
    }
  }

  async addMembers(chatId: string, userIds: string[]): Promise<ChatDocument> {
    try {
      // Verify all userIds are valid ObjectIds
      const validUserIds = userIds.every(id => Types.ObjectId.isValid(id));
      if (!validUserIds) {
        throw new BadRequestException('Invalid user ID(s) provided');
      }

      const updatedChat = await this.chatModel.findByIdAndUpdate(
        chatId,
        { 
          $addToSet: { users: { $each: userIds } },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      ).populate('users', 'username email profilePicUrl');

      if (!updatedChat) {
        throw new NotFoundException(`Chat with ID ${chatId} not found`);
      }

      return updatedChat;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to add members: ' + error.message);
    }
  }

  // Additional helper methods
  async isChatMember(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.chatModel.findOne({
      _id: chatId,
      users: userId
    });
    return !!chat;
  }

  async removeMembers(chatId: string, userIds: string[]): Promise<ChatDocument> {
    try {
      const updatedChat = await this.chatModel.findByIdAndUpdate(
        chatId,
        { 
          $pull: { users: { $in: userIds } },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      ).populate('users', 'username email profilePicUrl');

      if (!updatedChat) {
        throw new NotFoundException(`Chat with ID ${chatId} not found`);
      }

      return updatedChat;
    } catch (error) {
      throw new BadRequestException('Failed to remove members: ' + error.message);
    }
  }
}