import { Controller, Get, Param, Post, Patch, Req, UseGuards, Body } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./create-notifications.dto";
import { Public } from "src/auth/decorators/public.decorator";
import { Request } from "express";
import { AuthenticationGuard } from "src/auth/guards/authentication.guard";
import path from "path";

@UseGuards(AuthenticationGuard)
@Controller("notifications")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post()
    create(@Body() Body, @Req() req: Request) {
        return this.notificationService.CreateNotification(Body, req);
    }
    @Get()
    findAll() {
        return this.notificationService.findall();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notificationService.findOne(id);
    }
    @Patch(":id")
    update(@Param('id') id) {
        return this.notificationService.markRead(id);
    }
}