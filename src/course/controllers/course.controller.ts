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

  @Get('/search')
  async searchCourses(@Query('query') query: string) {
    return await this.courseService.searchCoursesByQuery(query);
  }

  @Get('search/category')
  async searchByCategory(@Query('category') category: string) {
    return await this.courseService.searchCoursesByCategory(category);
  }

  @Get('search/difficulty')
  async searchByDifficulty(@Query('difficulty') difficulty: string) {
    return await this.courseService.searchCoursesByDifficulty(difficulty);
  }

  @Get('search/users')
  async searchUsers(@Query('role') role: string, @Query('query') query: string) {
    return await this.courseService.searchUsersByRoleAndQuery(role, query);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      //call uploadFile method from user service

      storage: diskStorage({
        destination: './uploads', // Directory where files are saved
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
      },
      fileFilter: (req, file, callback) => {
        // Optional: File type validation
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
        }
      },
    }),
  )
  async uploadFile(
    @Param('id') courseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fileUrl = `/uploads/${file.filename}`;
    return await this.courseService.uploadFile(courseId, fileUrl, req.user.id);
  }
}

