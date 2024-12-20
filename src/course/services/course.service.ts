import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../models/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Instructor, User, UserDocument } from 'src/user/models/user.schema';
import * as mongoose from 'mongoose';
import * as Grid from 'gridfs-stream';
import { Readable } from 'stream';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class CourseService {

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Instructor.name) private instructorModel: Model<Instructor>,
  ) {}

  static get storage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `${file.originalname}`;
        console.log('Generated filename:', fileName);
        cb(null, fileName);
      }
    });
  }



async uploadResource(courseCode: string, file: Express.Multer.File): Promise<Course> {
  console.log('File received:', file);

  if (!file) {
    throw new BadRequestException('No file uploaded');
  }

  // Check if filename exists on the file object
  if (!file.filename) {
    throw new BadRequestException('File is missing or filename not set properly');
  }

  console.log('File upload initiated:', file);

  // Find the course by course code
  const course = await this.courseModel.findOne({ course_code: courseCode });
  if (!course) {
    throw new NotFoundException(`Course with code ${courseCode} not found`);
  }

  // Save the file metadata to the course
  const filePath = path.join('/uploads', file.filename);  // Save path relative to the server
  course.resources.push(filePath);  

  await course.save();
  console.log('Resource added to course:', filePath);
  return course;
}
async getResource(courseCode: string, fileName: string): Promise<fs.ReadStream> {
  // Construct the file path to the 'uploads' directory
  const filePath = path.join(__dirname, '../../uploads', fileName);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    // If the file does not exist, throw a NotFoundException
    throw new NotFoundException(`File not found: ${fileName}`);
  }

  // Return the file stream if the file exists
  return fs.createReadStream(filePath);
}



  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const course = new this.courseModel({
        ...createCourseDto,
        instructor: createCourseDto.instructor
      });
      //update the instructor's courses taught
      const instructor = await this.instructorModel.findById(createCourseDto.instructor);
      instructor.coursesTaught.push(course._id as any);
      return await course.save();
    } catch (error) {
      throw new BadRequestException('Invalid course data');
    }
  }

  async findAll(): Promise<Course[]> {
    return await this.courseModel.find().populate('instructor').exec();
  }

  async findOne(course_code: string): Promise<Course> {
    const course = await this.courseModel.findOne({
      _id: new Types.ObjectId(course_code), // Convert string to ObjectId
    }).populate('instructor').exec();
  
    if (!course) {
      throw new NotFoundException(`Course with code ${course_code} not found`);
    }
  
    return course;
  }
  async findOneByCourseId(course_id: string): Promise<Course> {
    const course = await this.courseModel.findById(course_id).populate('instructor').exec();
    
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }
  
    return course;
  }

  async update(course_code: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const updatedCourse = await this.courseModel
      .findOneAndUpdate({ course_code }, updateCourseDto, { new: true })
      .populate('instructor')
      .exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with code ${course_code} not found`);
    }
    return updatedCourse;
  }

  async delete(course_code: string): Promise<void> {
    const result = await this.courseModel.deleteOne({ course_code }).exec();
    console.log(result);
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Course with code ${course_code} not found`);
    }
  }

  async searchCoursesByCategory(category: string): Promise<Course[]> {
    return await this.courseModel.find({ category }).exec();
  }

  async searchCoursesByDifficulty(difficulty: string): Promise<Course[]> {
    return await this.courseModel.find({ difficulty }).exec();
  }



  
}