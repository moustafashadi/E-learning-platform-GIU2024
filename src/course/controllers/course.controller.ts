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

@UseGuards(AuthenticationGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Roles(Role.Instructor)
  @Post()
  async create(@Req() req: Request,
    @Body() { title, description, category, difficulty, course_code, numberofQuizzes }: { title: string, description: string, category: string, difficulty: string, course_code: string, numberofQuizzes: number }) {
    console.log("createCourseDto");
  
    // Add additional validation if needed
    if (!course_code || !title || !description || !category || !difficulty) {
      throw new BadRequestException("Missing required fields");
    }
  
    return await this.courseService.create(req, { course_code, title, description, numberofQuizzes, category, difficulty });
  }
  

  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get('/:course_code')
  async findOne(@Param('course_code') course_code: string) {
    return await this.courseService.findOne(course_code);
  }


  @Get('/:course_id')
  async findOneByCourseId(@Param('course_id') course_id: string) {
    return await this.courseService.findOneByCourseId(course_id);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.courseService.delete(id);
  }

  //GET ENROLLED STUDENTS
  @Get('/:id/students')
  async getEnrolledStudents(@Param('id') id: string) {
    return await this.courseService.getEnrolledStudents(id);
  }

  @Get('search/category')
  async searchByCategory(@Query('category') category: string) {
    return await this.courseService.searchCoursesByCategory(category);
  }

  @Get('search/difficulty')
  async searchByDifficulty(@Query('difficulty') difficulty: string) {
    return await this.courseService.searchCoursesByDifficulty(difficulty);
  }


  @Post(':courseCode/upload-resource')
  @UseInterceptors(FileInterceptor('file', { storage: CourseService.storage }))
  async uploadResource(
    @Param('courseCode') courseCode: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log('Received file in controller:', file);
    return this.courseService.uploadResource(courseCode, file);
  }


  @Get(':courseCode/resource/:fileName')
  async getResource(
    @Param('courseCode') courseCode: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.courseService.getResource(courseCode, fileName);

      // Pipe the file stream to the response
      fileStream.pipe(res);
    } catch (error) {
      throw new NotFoundException(`Resource not found for course: ${courseCode}, file: ${fileName}`);
    }
  }

  //GET COURSE QUIZZES
  @Get('/:courseId/quizzes')
  async getCourseQuizzes(@Param('courseId') courseId: string) {
    return await this.courseService.getCourseQuizzes(courseId);
  }

  @Get('/teacher/:instructorId')
  async findCoursesByInstructor(
    @Param('instructorId') instructorId: string,
  ) {
    return await this.courseService.findCoursesByInstructor(instructorId);
  }

}

