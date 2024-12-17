import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './chat.schema';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatsDto } from './dto/get-chat.dto';
import { SearchChatsDto } from './dto/search-chats.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}

  getChats(getChatsDto: GetChatsDto ) {
    return this.chatModel.find({
      skip: getChatsDto.skip,
      take: getChatsDto.take,
      order: { createdAt: 'DESC' },
    });
  }

  getChat(id: number) {
    return this.chatModel.findOne({ id });
  }

  async searchChats(searchChatsDto: SearchChatsDto) {
    const query = this.chatModel.find();
    if (searchChatsDto.skip) {
      query.skip(searchChatsDto.skip);
    }
    if (searchChatsDto.take) {
      query.limit(searchChatsDto.take);
    }
    if (searchChatsDto.title) {
      query.where('title', new RegExp(searchChatsDto.title, 'i'));
    }
    if (searchChatsDto.ownerId) {
      query.where('owner.id', searchChatsDto.ownerId);
    }
    const items = await query.exec();
    const count = await this.chatModel.countDocuments(query.getFilter());
    return { items, count };
  }

  async createChat(createChatDto: CreateChatDto, userId: string) {
    const chat = new this.chatModel({
      title: createChatDto.title,
      description: createChatDto.description,
      owner: { id: userId },
    });
    await chat.save();
  }

  async updateChat(id: string, updateChatDto: UpdateChatDto, userId: string) {
    const result = await this.chatModel.updateOne(
      { id, owner: { id: userId } },
      updateChatDto,
    );
    if (!result.acknowledged) {
      throw new NotFoundException(`chat with id ${id} not found`);
    }
  }

  async deleteChat(id: string, userId: string) {
    const result = await this.chatModel.deleteOne({
      id,
      owner: { id: userId },
    });
    if (!result.acknowledged) {
      throw new NotFoundException(`chat with id ${id} not found`);
    }
  }
}