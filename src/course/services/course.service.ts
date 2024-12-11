import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from '../models/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Instructor, User, UserDocument } from 'src/user/models/user.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Instructor.name) private instructorModel: Model<Instructor>,
  ) {}

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
    return await this.courseModel.find().populate('created_by').exec();
  }

  async findOne(course_code: string): Promise<Course> {
    const course = await this.courseModel.findOne({ course_code }).populate('created_by').exec();
    if (!course) {
      throw new NotFoundException(`Course with code ${course_code} not found`);
    }
    return course;
  }

  async update(course_code: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const updatedCourse = await this.courseModel
      .findOneAndUpdate({ course_code }, updateCourseDto, { new: true })
      .populate('created_by')
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

  async uploadFile(courseId: string, resourceUrl: string, userId: string): Promise<Course> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const user = await this.userModel.findById(userId);
    if (!user || user.role !== 'instructor') {
      throw new UnauthorizedException('Only instructors can upload resources');
    }

    course.resources.push(resourceUrl);
    return await course.save();
  }
}
