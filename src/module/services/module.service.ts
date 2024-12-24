import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../models/module.schema';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
  ) {}

  // Create a new module
  async create(courseId: string, createModuleDto: CreateModuleDto): Promise<Module> {
    const newModule = new this.moduleModel(courseId, createModuleDto);
    return await newModule.save();
  }

  // Retrieve all modules
  async findAll(): Promise<Module[]> {
    return await this.moduleModel.find().populate('courses').exec();
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
