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
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { ForumService } from './forum.service'; 
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthenticationGuard)
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Delete(':courseId/deleteStudentForum/:forumId')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(Role.Instructor)
  async deleteStudentForum(
   @Param('courseId') courseId: string,
   @Param('forumId') forumId: string,
   @Req() req: any
 ) {
   console.log('Request User:', req.user); // Log user object
   console.log('Course ID:', courseId); // Log course ID
   console.log('Forum ID:', forumId); // Log forum ID
 
  
   const instructorId = req.user.id;
   return this.forumService.instructordeleteStudentForum(courseId, forumId, instructorId);
 }
  

 
   //TESTED WORKIG
  // API to delete a forum from a course
  @Delete(':courseId/forum/:forumId')
  async deleteForum(@Param('courseId') courseId: string, @Param('forumId') forumId: string) {
    try {
      await this.forumService.deleteForum(courseId, forumId);
      return { message: 'Forum deleted successfully' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  //TESTED WORKIG
  @Post(':courseId/forum')
    async createForum(
      @Param('courseId') courseId: string,
      @Body() payload: { title: string; content: string; tag: string; createdBy: string }
    ) {
      try {
        const forum = await this.forumService.createForum(courseId, payload);
        return { message: 'Forum created successfully', forum };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }


   //TESTED WORKIG
  @Get('course/:courseId')
  async getForumsForCourse(@Param('courseId') courseId: string) {
    return this.forumService.getForumsForCourse(courseId);
  }


  //TESTED WORKIG
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


//TESTED WORKING
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



//TESTED WORKIG
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor, Role.Student)
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

//estana
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



  //TESTED WORKIG
  @Get(':forumId')
  async getForum(@Param('forumId') forumId: string) {
    return this.forumService.getForumById(forumId);
  }

  @Get('thread/:threadId')
  async getThread(@Param('threadId') threadId: string) {
    return this.forumService.getThreadById(threadId);
  }


  @UseGuards(AuthorizationGuard)
  @Roles(Role.Student, Role.Instructor)
  @Delete('thread/:threadId')
  async deleteThread(@Param('threadId') threadId: string) {
    await this.forumService.deleteThread(threadId);
    return { message: 'Thread deleted' };
  }







}
