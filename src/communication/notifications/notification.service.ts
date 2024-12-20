import { Model } from "mongoose";
import { NotificationDocument } from "./notification.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateNotificationDto } from "./create-notifications.dto";
import { Chat, ChatDocument } from "../chat/chat.schema";
import { Notification } from "./notification.schema";
import { UserService } from "src/user/services/user.service";
import { Body, Injectable, NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";
@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        private userService: UserService,
    ) { }


    async CreateNotification(@Body() Body ,@Req() req: Request): Promise<Notification> {
        // return this.notificationModel.create({cr}); w hot el constructors (cr:create-notifications.dto) shyel el taht w a3ml return de
        const userId = req.user['sub'];
        const createdNotification = new this.notificationModel({
            message: Body.message,
            recipient: [await this.userService.findAll()],
            creator: userId,
        }
        );
        return createdNotification.save();
    }

    async findall(): Promise<Notification[]> {
        const notification = await this.notificationModel.find().exec();
        console.log("Fetched Notifications:", notification);
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
