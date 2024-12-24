import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { ModuleService } from '../services/module.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthenticationGuard)
@Controller('/:courseId/module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Instructor)
  @Post()
  async create(@Param('courseId') courseId: string, @Body() createModuleDto: CreateModuleDto) {
    return await this.moduleService.create(createModuleDto);
  }

  @Get()
  async findAll() {
    return await this.moduleService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') moduleId: string) {
    return await this.moduleService.findOne(moduleId);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return await this.moduleService.update(id, updateModuleDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.moduleService.delete(id);
  }

  @Get('search')
  async searchModules(@Query('query') query: string) {
    return await this.moduleService.searchModules(query);
  }

  @Get('search/title')
  async getModuleByTitle(@Query('title') title: string) {
    return await this.moduleService.getModuleByTitle(title);
  }
}
