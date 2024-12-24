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

import { ModuleService } from '../services/module.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@UseGuards(AuthenticationGuard)
@Controller('/:courseId/modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  
   //TEST-WORKING
  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Post()
  async create(@Param('courseId') courseId: string, @Body() createModuleDto: CreateModuleDto) {
    return await this.moduleService.create( courseId, createModuleDto);
  }

   //TEST-WORKING
  @Get()
  async findAll() {
    return await this.moduleService.findAll();
  }

  //TEST-WORKING
  @Get('/:id')
  async findOne(@Param('id') moduleId: string) {
    return await this.moduleService.findOne(moduleId);
  }


  //TEST-WORKING
  @Patch('/:id')
  async update(@Param('id') moduleId: string, @Body() updateModuleDto: UpdateModuleDto) {
    return await this.moduleService.update(moduleId, updateModuleDto);
  }

  //TEST-WORKING
  @Delete('/:id')
  async delete(@Param('id') moduleId: string) {
    return await this.moduleService.delete(moduleId);
  }

  //TEST-WORKING
  @Get('search/title')
  async getModulesByTitle(@Query('title') title: string) {
    return await this.moduleService.getModulesByTitle(title);
  }

  //TEST-WORKING
  @Get('search/difficulty')
  async getModulesByDifficulty(@Query('difficulty') difficulty: string) {
    return await this.moduleService.getModulesByDifficulty(difficulty);
  }









  @Post(':moduleId/upload-resource')
  @UseInterceptors(FileInterceptor('file', { storage: ModuleService.storage }))
  async uploadResource(
    @Param('moduleId') moduleId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.moduleService.uploadResource(moduleId, file);
  }



  @Get('resource/:moduleId/:fileName')
  async getResource(
    @Param('moduleId') moduleId: string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.moduleService.getResource( fileName);
      fileStream.pipe(res);
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  }





}
