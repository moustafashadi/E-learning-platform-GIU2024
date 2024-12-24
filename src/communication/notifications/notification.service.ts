import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { UserService } from 'src/user/services/user.service';
import * as mongoose from 'mongoose';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private userService: UserService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(message: string, recipient: string): Promise<Notification> {
    const user = await this.userService.findOne(recipient);

    const notification = new this.notificationModel({ message, recipient });

    user.notifications.push(notification._id as any);

    await user.save();


    return notification.save();
  }

  async createMessageNotification( recipient: string, message: string): Promise<Notification> {
    const notification = await this.createNotification(`New message: ${message}`, recipient);
    return notification;
  }

  async createReplyNotification(message: string, recipient: string): Promise<Notification> {
    return this.createNotification(`New reply: ${message}`, recipient);
  }

  async createAnnouncementNotification(message: string, recipient: string): Promise<Notification> {
    return this.createNotification(`New announcement: ${message}`, recipient);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findByRecipient(recipient: string): Promise<Notification[]> {
    return this.notificationModel.find({ recipient }).exec();
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    notification.read = true;
    return notification.save();
  }
}