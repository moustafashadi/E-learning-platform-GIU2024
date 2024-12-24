// src/communication/chat/message.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './message.model';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatService } from './chat.service';
import { Chat } from './chat.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel('Chat') private chatModel: Model<Chat>,
    private chatService: ChatService
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    try {
      // Validate chatId
      if (!Types.ObjectId.isValid(createMessageDto.chatId)) {
        throw new BadRequestException('Invalid chat ID');
      }

      // Check if chat exists and user is a member
      const chat = await this.chatModel.findById(createMessageDto.chatId);
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }

      // Create and save the message
      const message = new this.messageModel({
        content: createMessageDto.content,
        senderId: new Types.ObjectId(createMessageDto.senderId),
        chatId: new Types.ObjectId(createMessageDto.chatId),
        timestamp: new Date()
      });

      const savedMessage = await message.save();

      // Update the chat with the new message
      await this.chatModel.findByIdAndUpdate(
        createMessageDto.chatId,
        {
          $push: { messages: savedMessage._id },
          $set: { updatedAt: new Date() }
        }
      );

      return await savedMessage.populate('senderId', 'username email');
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create message: ' + error.message);
    }
  }

  async getMessages(chatId: string): Promise<MessageDocument[]> {
    try {
      if (!Types.ObjectId.isValid(chatId)) {
        throw new BadRequestException('Invalid chat ID');
      }

      return await this.messageModel
        .find({ chatId: new Types.ObjectId(chatId) })
        .populate('senderId', 'username email')
        .sort({ timestamp: 1 });
    } catch (error) {
      throw new BadRequestException('Failed to get messages: ' + error.message);
    }
  }
}