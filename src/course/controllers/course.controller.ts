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
  Req,
  UseGuards
}
  from '@nestjs/common';

  
import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express'; // Ensure Express types are available
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
  async create(@Body() createCourseDto: CreateCourseDto) {
    console.log("createCourseDto");

    return await this.courseService.create(createCourseDto);
  }

  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get('/:course_code')
  async findOne(@Param('course_code') course_code: string) {
    return await this.courseService.findOne(course_code);
  }

  @Patch('/:course_code')
  async update(
    @Param('course_code') course_code: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.update(course_code, updateCourseDto);
  }

  @Delete('/:course_code')
  async delete(@Param('course_code') course_code: string) {
    return await this.courseService.delete(course_code);
  }



  @Get('search/category')
  async searchByCategory(@Query('category') category: string) {
    return await this.courseService.searchCoursesByCategory(category);
  }

  @Get('search/difficulty')
  async searchByDifficulty(@Query('difficulty') difficulty: string) {
    return await this.courseService.searchCoursesByDifficulty(difficulty);
  }

  @Post(':courseCode/resources')
  async addResource(
    @Param('courseCode') courseCode: string,
    @Body('fileUrl') fileUrl: string,
  ) {
    const updatedCourse = await this.courseService.addResource(courseCode, fileUrl);
    return updatedCourse;
  }


}

