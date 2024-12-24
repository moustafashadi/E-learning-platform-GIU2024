import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, NotFoundException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Request, Response } from 'express';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  //TESTED - WORKING
  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //TESTED - WORKING
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //TESTED - WORKING
  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    return this.userService.logout(request, response);
  }

  //TESTED - WORKING
  @UseGuards(AuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  //TESTED - WORKING
  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  //TESTED - WORKING
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  //TESTED - WORKING
  @UseGuards(AuthenticationGuard)
  @Get('/:id/completedCourses')
  getCompletedCourses(@Param('id') id: string) {
    return this.userService.getCompletedCourses(id);
  }

  //TESTED - WORKING
  @UseGuards(AuthenticationGuard)
  @Get(':userId/enrolledCourses')
  async getEnrolledCourses(@Param('userId') userId: string) {
    return this.userService.getEnrolledCourses(userId);
  }

  //add enroll course 
  @UseGuards(AuthenticationGuard)
  @Roles(Role.Student)
  @Post(':id/enroll/:courseId')
  async enrollCourse(
    @Param('id') userId: string,
    @Param('courseId') courseId: string
  ) {
    return await this.userService.enrollCourse(userId, courseId);
  }

  //get notifications
  @UseGuards(AuthenticationGuard)
  @Get(':userId/notifications')
  async getNotifications(@Param('userId') userId: string) {
    return this.userService.getNotifications(userId);
  }

  //get enrolled courses for a student
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Get(':userId/enrolledCourses')
  async getEnrolledCoursesForInstructor(@Param('userId') userId: string) {
    return this.userService.getEnrolledCoursesForInstructor(userId);
  }
}