import { Model } from "mongoose";
import { NotificationDocument } from "../models/notification.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateNotificationDto } from "../dto/create-notifications.dto";
import { Chat, ChatDocument } from "../models/chat.schema";
import { Notification } from "../models/notification.schema";
import { UserService } from "src/user/services/user.service";
import { Injectable, NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";
@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        private userService: UserService,
    ) { }


    async CreateNotification(@Req() req: Request): Promise<Notification> {
        // return this.notificationModel.create({cr}); w hot el constructors (cr:create-notifications.dto) shyel el taht w a3ml return de
        const creator = await this.userService.getCurrentUser(req);
        const createdChat = new this.notificationModel({
            messages: [],
            recipient: [creator._id],
            creator: creator._id,
        }
        );
        return createdChat.save();
    }

    async findall(): Promise<Notification[]> {
        const notification = await this.notificationModel.find().exec();
        return [...notification];
    }

    async findOne(id: string): Promise<Notification> {

        const notification = await this.notificationModel.findById(id).exec();
        if (!notification)
            throw new NotFoundException("there is no notification with this id");
        return notification;
    }

    async markRead(id: string): Promise<Notification> {
        return await this.notificationModel.findByIdAndUpdate(id, { isRead: true });
    }
}
