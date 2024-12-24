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
  Res,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express, Request } from 'express';
import { Response } from 'express';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

@UseGuards(AuthenticationGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  //TESTED -WORKING
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Post()
  async create(@Req() req: Request,
    @Body() createCourseDto: CreateCourseDto) {

    return await this.courseService.create(req, createCourseDto);
  }

  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(id);
  }

  //TESTED -WORKING
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

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.courseService.delete(id);
  }

  // GET ENROLLED STUDENTS
  @Get('/:id/students')
  async getEnrolledStudents(@Param('id') id: string) {
    return await this.courseService.getEnrolledStudents(id);
  }

  // Search Courses by Keyword
  @Get('search/keyword')
  async searchByKeyword(@Query('keyword') keyword: string) {
    return await this.courseService.searchCoursesByKeyword(keyword);
  }

  @Get('search/category')
  async searchByCategory(@Query('category') category: string) {
    return await this.courseService.searchCoursesByCategory(category);
  }

  @Get('search/difficulty')
  async searchByDifficulty(@Query('difficulty') difficulty: string) {
    return await this.courseService.searchCoursesByDifficulty(difficulty);
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






  @Get('/teacher/:instructorId')
  async findCoursesByInstructor(@Param('instructorId') instructorId: string) {
    return await this.courseService.findCoursesByInstructor(instructorId);
  }




}

