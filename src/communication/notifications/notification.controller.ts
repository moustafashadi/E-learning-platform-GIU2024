import { Controller, Post, Body } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService
  ) { }

  @Post('message')
  async sendMessageNotification(@Body() sendNotificationDto: SendNotificationDto) {
    const { userId, message } = sendNotificationDto;
    await this.notificationService.createMessageNotification(userId, message);
    return { status: 'Message notification sent' };
  }

  @Post('reply')
  async sendReplyNotification(@Body() sendNotificationDto: SendNotificationDto) {
    const { userId, message } = sendNotificationDto;
    await this.notificationGateway.sendReplyNotification(userId, message);
    return { status: 'Reply notification sent' };
  }

  @Post('announcement')
  async sendAnnouncementNotification(@Body() sendNotificationDto: SendNotificationDto) {
    const { userId, message } = sendNotificationDto;
    await this.notificationGateway.sendAnnouncementNotification(userId, message);
    return { status: 'Announcement notification sent' };
  }
}