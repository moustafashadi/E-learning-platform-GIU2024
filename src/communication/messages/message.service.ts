import { Injectable, Param } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private readonly messageModel: Model<Message>,
        private readonly messageService: MessageService,
    ) { }

    async getMessages(@Param('chatId') chatId: string) {
        return this.messageService.findBy(chatId);
    }

    async createMessage(createMessageDto: CreateMessageDto) {
        const message = new this.messageModel(createMessageDto);
        await message.save();
        return message;
    }

    async findBy(chatId: string) {
        return await this.messageModel.find({ chat: chatId });
    }
}