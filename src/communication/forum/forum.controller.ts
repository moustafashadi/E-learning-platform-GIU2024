import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "src/auth/guards/authentication.guard";
import { ForumServices } from "./forum.service";
import { Request } from "express";
import { Req, } from "@nestjs/common";

@UseGuards(AuthenticationGuard)
@Controller('/forums')
export class ForumController {
   constructor(
      private readonly forumService: ForumServices
   ) { }

   @Post(":courseId/create")
   createForum(@Param('CourseId') courseId: string, @Req() req: Request) {
      this.forumService.createForum(courseId, req);
   }

   @Get("/:courseId/")
   findAll(@Param('courseId') courseId: string) {
      return this.forumService.findAll(courseId);
   }

   @Get(":id")
   findOne(@Param('id') id: string) {
      return this.forumService.findOne(id);
   }
   @Post(":id/thread")
   createThread(@Req() req: Request, @Param('id') forumid: string) {
      return this.forumService.addThread(req, forumid);
   }

   @Get("thread/:id")
   findThread(@Param('id') id: string) {
      return this.forumService.findOneThread(id);
   }

   //findAllThreads
   @Get(":forumId/threads/")
   findAllThreads(@Param('forumId') forumId: string) {
      return this.forumService.findAllThreads(forumId);
   }

   @Post("reply/:id")
   createReply(@Req() req: Request, @Param('id') threadId: string, @Body() reply) {
      return this.forumService.reply(req, threadId, reply);
   }


}