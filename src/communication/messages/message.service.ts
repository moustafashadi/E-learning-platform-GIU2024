import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Model } from 'mongoose';


@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  getMessages(getMessagesDto: GetMessagesDto) {
    return this.messageModel.find({
      room: { id: getMessagesDto.chat },
    });
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const message = new this.messageModel(createMessageDto);
    await message.save();
    return message;
  }
}