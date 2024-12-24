import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Module, ModuleDocument } from '../models/module.schema';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { Course, CourseDocument } from '../../course/models/course.schema';
import { Resource, ResourceDocument } from 'src/resources/resources.schema';
import { Readable } from 'stream';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Resource.name) private resourceModel: Model<ResourceDocument>,

 
  ) {}

 async create(courseId: string, createModuleDto: CreateModuleDto): Promise<Module> {
  // Ensure the course exists
  const course = await this.courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundException(`Course with ID ${courseId} not found`);
  }
  // Create the new module
  const newModule = new this.moduleModel({
    ...createModuleDto,
    course: new Types.ObjectId(courseId), // Ensure courseId is an ObjectId
    resources: [],
    questions: [],
    rating: [],
  });
  const savedModule = await newModule.save();
  // Update the course's modules array to include the new module's ID
  course.modules.push(savedModule._id as any);
  await course.save();
  return savedModule;
}

  async findAll(): Promise<Module[]> {
    return await this.moduleModel.find().exec();
  }

  async findOne(moduleId: string): Promise<Module> {
    const module = await this.moduleModel
      .findById(moduleId)
      .exec();
    if (!module) {
      throw new NotFoundException(`Module with id: ${moduleId} not found`);
    }
    return module;
  }


  async update(moduleId: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const updatedModule = await this.moduleModel
      .findOneAndUpdate({ _id: moduleId }, updateModuleDto, { new: true })
      .exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with id ${moduleId} not found`);
    }
    return updatedModule;
  }

  // Delete a module
  async delete(moduleId: string): Promise<void> {
    const result = await this.moduleModel.deleteOne({ _id: moduleId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Module with code ${moduleId} not found`);
    }
    else{
      console.log("Module Deleted");
    }
  }


   // Get modules by their title
   async getModulesByTitle(title: string): Promise<Module[]> {
    const modules = await this.moduleModel
      .find({ title })
      .exec();
    if (!modules || modules.length === 0) {
      throw new NotFoundException(`No modules with title "${title}" found`);
    }
    return modules;
  }

  
  async getModulesByDifficulty(difficulty: string): Promise<Module[]> {
    const modules = await this.moduleModel
      .find({ difficulty })
      .exec();
    if (!modules || modules.length === 0) {
      throw new NotFoundException(`No modules with difficulty "${difficulty}" found`);
    }
    return modules;
  }




  static get storage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        // Define the 'uploads' folder in the project root
        const uploadPath = path.join(__dirname, '../../../../uploads'); // Ensures the uploads folder exists
        fs.mkdirSync(uploadPath, { recursive: true });  // Create the uploads folder if it doesn't exist
        cb(null, uploadPath);  // Set the destination folder
      },
      filename: (req, file, cb) => {
        // Generate a unique filename using original name and timestamp for uniqueness
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `${file.originalname}`;
        console.log('Generated filename:', fileName);
        cb(null, fileName);  // Use the original file name, or modify as needed
      },
    });
  }
  
  
  async uploadResource(moduleId: string, file: Express.Multer.File): Promise<Module> {
    console.log('File received:', file);
    // Ensure that file is provided
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // Ensure the filename is set properly
    if (!file.filename) {
      throw new BadRequestException('File is missing or filename not set properly');
    }
    console.log('File upload initiated:', file);
    // Find the module by module ID
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    // Check if a resource already exists for this module
    let resource = await this.resourceModel.findOne({ title: file.filename });

    if (!resource) {
      // Create a new resource if it doesn't exist
      resource = new this.resourceModel({
        title: file.filename,
        file: [file.filename], // Initialize the file array with the uploaded file path
        isAvailable: [true], // Initialize the isAvailable array with true
        versions: 1, // Start with version 1
      });
    } else {
      // Update the existing resource
      resource.versions += 1;
      resource.file.push(file.filename);
      resource.isAvailable = resource.isAvailable.map(() => false); // Set all previous isAvailable values to false
      resource.isAvailable.push(true); // Add the new isAvailable value as true
    }

    await resource.save();
    // Update the module's resources array to include only the new resource's ID
    module.resources.push(resource._id as unknown as Types.ObjectId as any);
    await module.save();
    console.log('Resource added to module:', file.filename);
    return module;
  }



  async getResource(fileName: string): Promise<fs.ReadStream> {
    // Construct the file path
    const filePath = path.join(__dirname, '../../../../uploads', fileName);
    console.log('Constructed file path:', filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File "${fileName}" not found on server`);
    }

    // Create a read stream for the file
    return fs.createReadStream(filePath);
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