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
  Req,Res,
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
import { Express } from 'express'; 
import { Response } from 'express';
import { Module } from '@nestjs/common';
import { Course } from '../models/course.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import * as path from 'path';
import * as fs from 'fs';

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

  @Get('/by-id/:course_id')
async findOneByCourseId(@Param('course_id') course_id: string) {
  return await this.courseService.findOneByCourseId(course_id);
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


}

