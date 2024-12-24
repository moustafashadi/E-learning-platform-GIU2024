import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req, Res,
  UseGuards,
  BadRequestException,
  NotFoundException
}
  from '@nestjs/common';


import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Request } from 'express';
import { Response } from 'express';
import { Module } from '@nestjs/common';
import { Course } from '../models/course.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

@UseGuards(AuthenticationGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  //TESTED -WORKING
  //create a course
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Post()
  async create(@Req() req: Request,
    @Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(req, createCourseDto);
  }

  //TESTED -WORKING
  //get all courses
  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  //TESTED -WORKING
  //get a course by id
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(id);
  }

  //TESTED -WORKING
  //update a course
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Patch('/:id')
  async update(
    @Req() req: Request,
    @Param('id') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    console.log(courseId);
    return await this.courseService.update(req, courseId, updateCourseDto);
  }


  //TESTED -WORKING
  //delete a course
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.courseService.delete(id);
  }


  //TESTED -WORKING
  //search by keyword
  @Get('search/keyword')
  async searchByKeyword(@Query('keyword') keyword: string) {
    return await this.courseService.searchCoursesByKeyword(keyword);
  }


  //Tested - Working
  //search by category
  @Get('search/category')
  async searchByCategory(@Query('category') category: string) {
    return await this.courseService.searchCoursesByCategory(category);
  }


  
  //TESTED -WORKING
  //get all courses for an instructor
  @Get('/teacher/:instructorId')
  async findCoursesByInstructor(
    @Param('instructorId') instructorId: string,
  ) {
    return await this.courseService.findCoursesByInstructor(instructorId);
  }



  //TESTED -WORKING
  //get all enrolled students for a course
  @Get('/:id/students')
  async getEnrolledStudents(@Param('id') id: string) {
    return await this.courseService.getEnrolledStudents(id);
  }



  // @Post(':courseId/upload-resource')
  // @UseInterceptors(FileInterceptor('file', { storage: CourseService.storage }))
  // async uploadResource(
  //   @Param('courseId') courseId: string,
  //   @UploadedFile() file: Express.Multer.File
  // ) {
  //   return this.courseService.uploadResource(courseId, file);
  // }




  // @Get(':courseId/resource/:fileName')
  // async getResource(
  //   @Param('courseId') courseId: string,
  //   @Param('fileName') fileName: string,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const fileStream = await this.courseService.getResource(courseId, fileName);

  //     // Pipe the file stream to the response
  //     fileStream.pipe(res);
  //   } catch (error) {
  //     throw new NotFoundException(`Resource not found for course: ${courseId}, file: ${fileName}`);
  //   }
  // }



}

