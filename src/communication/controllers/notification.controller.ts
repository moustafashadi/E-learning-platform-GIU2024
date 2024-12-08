import { Controller, Get, Param, Post, Patch, Req, UseGuards } from "@nestjs/common";
import { NotificationService } from "../services/notification.service";
import { CreateNotificationDto } from "../dto/create-notifications.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { Request } from "express";
import { AuthenticationGuard } from "src/auth/guards/authentication.guard";
import path from "path";

@UseGuards(AuthenticationGuard)
@Controller("notification")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    create(@Req() req: Request) {
        return this.notificationService.CreateNotification(req);
    }
    @Get()
    findAll() {
        return this.notificationService.findall();
    }
    @Get('id')
    findOne(@Param('id') id: string) {
        return this.notificationService.findOne(id);
    }
    @Patch()
    update(@Param('id') id: string) {
        return this.notificationService.markRead(id);
    }
}