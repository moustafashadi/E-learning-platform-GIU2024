import { Controller, Get, Post, Body, Param, Patch, Query, Delete, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get(':course_code')
  async findOne(@Param('course_code') course_code: string) {
    return await this.courseService.findOne(course_code);
  }

  @Patch(':course_code')
  async update(
    @Param('course_code') course_code: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.update(course_code, updateCourseDto);
  }

  @Delete(':course_code')
  async delete(@Param('course_code') course_code: string) {
    return await this.courseService.delete(course_code);
  }

  @Get('search')
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
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') courseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const fileUrl = `/uploads/${file.filename}`;
    const userId = req.user.id; // Assuming `user` is set by authentication middleware
    return await this.courseService.uploadResource(courseId, fileUrl, userId);
  }
}
