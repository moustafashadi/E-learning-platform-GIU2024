import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../models/module.schema';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel('Course') private courseModel: Model<any>,
  ) {}

  // Create a new module
  async create(courseId : string, createModuleDto: CreateModuleDto): Promise<Module> {
    try {
      const newModule = new this.moduleModel(createModuleDto);
      const course = await this.courseModel.findById(courseId);
      course.modules.push(newModule._id as any);
      await course.save();
      return await newModule.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating module');
    }
  }

  // Retrieve all modules
  async findAll(): Promise<Module[]> {
    return await this.moduleModel.find().populate('courses').exec();
  }

  //find modules depending on course
  async findModulesByCourse(courseId: string): Promise<Module[]> {
    const course =  await this.courseModel.findById(courseId);

    const moduleIds = course.modules;

    const modules = await this.moduleModel.find().where('_id').in(moduleIds).exec();

    return modules;
  }

  // Retrieve a single module by its ID
  async findOne(module_code: string): Promise<Module> {
    const module = await this.moduleModel
      .findOne({ module_code })
      .populate('courses')
      .exec();
    if (!module) {
      throw new NotFoundException(`Module with code ${module_code} not found`);
    }
    return module;
  }

  // Update a module
  async update(module_code: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const updatedModule = await this.moduleModel
      .findOneAndUpdate({ module_code }, updateModuleDto, { new: true })
      .populate('courses')
      .exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with code ${module_code} not found`);
    }
    return updatedModule;
  }

  // Delete a module
  async delete(module_code: string): Promise<void> {
    const result = await this.moduleModel.deleteOne({ module_code }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Module with code ${module_code} not found`);
    }
  }

  // Search modules by query
  async searchModules(query: string): Promise<Module[]> {
    return await this.moduleModel.find({ $text: { $search: query } }).exec();
  }

  // Get module by its title
  async getModuleByTitle(title: string): Promise<Module> {
    const module = await this.moduleModel
      .findOne({ title })
      .populate('courses')
      .exec();
    if (!module) {
      throw new NotFoundException(`Module with title "${title}" not found`);
    }
    return module;
  }

  // // Upload resources to a module
  // async uploadResource(module_code: string, resourceUrl: string): Promise<Module> {
  //   const module = await this.moduleModel.findOne({ module_code });
  //   if (!module) {
  //     throw new NotFoundException(`Module with code ${module_code} not found`);
  //   }
  //   const resource = this.resourceModel.create({ title: 'Resource', file: resourceUrl, isAvailable: true, versions: 1 });
  //   module.resources.push(resourceUrl);
  //   return await module.save();
  // }
}
