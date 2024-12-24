import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private userService: UserService,
  ) {}

  async createNotification(message: string, recipient: string): Promise<Notification> {
    const notification = new this.notificationModel({ message, recipient });
    return notification.save();
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