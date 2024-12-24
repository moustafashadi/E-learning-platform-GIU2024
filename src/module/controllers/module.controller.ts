import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { ModuleService } from '../services/module.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { create } from 'domain';

@UseGuards(AuthenticationGuard)
@Controller('/:courseId')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  async create(@Param('courseId') courseId: string, @Body() createModuleDto: CreateModuleDto) {
    return await this.moduleService.create(courseId, createModuleDto);
  }

  @Get()
  async findAll() {
    return await this.moduleService.findAll();
  }

  @Get(':module_code')
  async findOne(@Param('module_code') module_code: string) {
    return await this.moduleService.findOne(module_code);
  }

  @Patch(':module_code')
  async update(@Param('module_code') module_code: string, @Body() updateModuleDto: UpdateModuleDto) {
    return await this.moduleService.update(module_code, updateModuleDto);
  }

  @Delete(':module_code')
  async delete(@Param('module_code') module_code: string) {
    return await this.moduleService.delete(module_code);
  }

  @Get('search')
  async searchModules(@Query('query') query: string) {
    return await this.moduleService.searchModules(query);
  }

  @Get('search/title')
  async getModuleByTitle(@Query('title') title: string) {
    return await this.moduleService.getModuleByTitle(title);
  }

  // @Post(':module_code/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         callback(null, `${uniqueSuffix}-${file.originalname}`);
  //       },
  //     }),
  //   }),
  // )
  // async uploadResource(
  //   @Param('module_code') module_code: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   const fileUrl = `/uploads/${file.filename}`;
  //   return await this.moduleService.uploadResource(module_code, fileUrl);
  // }
}
