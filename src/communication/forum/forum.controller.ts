import {
   Controller,
   Get,
   Post,
   Param,
   Body,
   Put,
   Delete,
   UseGuards,
   BadRequestException,
   NotFoundException,
 } from '@nestjs/common';
 
 import { ForumService } from './forum.service'; 
 import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
 import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
 import { Roles, Role } from 'src/auth/decorators/roles.decorator';
 
 @UseGuards(AuthenticationGuard)
 @Controller('forum')
 export class ForumController {
   constructor(private readonly forumService: ForumService) {}

   @Get('course/:courseId')
   async getForumsForCourse(@Param('courseId') courseId: string) {
     return this.forumService.getForumsForCourse(courseId);
   }

   @UseGuards(AuthorizationGuard)
   @Roles(Role.Student, Role.Instructor)
   @Post(':forumId/addThread')
   async addThreadToForum(
     @Param('forumId') forumId: string,
     @Body() { content, createdBy }: { content: string; createdBy: string },
   ) {
     if (!content || !createdBy) {
       throw new BadRequestException('Missing content or createdBy');
     }
     return this.forumService.addThreadToForum(forumId, content, createdBy);
   }

   @UseGuards(AuthorizationGuard)
   @Roles(Role.Student, Role.Instructor)
   @Post('thread/:threadId/addSubThread')
   async addThreadToThread(
     @Param('threadId') threadId: string,
     @Body() { content, createdBy }: { content: string; createdBy: string },
   ) {
     if (!content || !createdBy) {
       throw new BadRequestException('Missing content or createdBy');
     }
     return this.forumService.addThreadToThread(threadId, content, createdBy);
   }
 

   @UseGuards(AuthorizationGuard)
   @Roles(Role.Instructor)
   @Put(':forumId')
   async updateForum(
     @Param('forumId') forumId: string,
     @Body() { title, content }: { title?: string; content?: string },
   ) {
     if (!title && !content) {
       throw new BadRequestException('Must provide title or content to update');
     }
     return this.forumService.updateForum(forumId, title, content);
   }
 

   @UseGuards(AuthorizationGuard)
   @Roles(Role.Student, Role.Instructor)
   @Put('thread/:threadId')
   async updateThread(
     @Param('threadId') threadId: string,
     @Body() { content }: { content?: string },
   ) {
     if (!content) {
       throw new BadRequestException('Must provide content to update thread');
     }
     return this.forumService.updateThread(threadId, content);
   }

   @Get(':forumId')
   async getForum(@Param('forumId') forumId: string) {
     return this.forumService.getForumById(forumId);
   }

   @Get('thread/:threadId')
   async getThread(@Param('threadId') threadId: string) {
     return this.forumService.getThreadById(threadId);
   }

   @UseGuards(AuthorizationGuard)
   @Roles(Role.Instructor)
   @Delete(':forumId')

   @UseGuards(AuthorizationGuard)
   @Roles(Role.Student, Role.Instructor)
   @Delete('thread/:threadId')
   async deleteThread(@Param('threadId') threadId: string) {
     await this.forumService.deleteThread(threadId);
     return { message: 'Thread deleted' };
   }
 }
 