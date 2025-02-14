import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress, ProgressDocument } from '../models/progress.schema';
import { Student, StudentDocument, User, UserDocument } from 'src/user/models/user.schema';
import { Course, CourseDocument } from 'src/course/models/course.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) { }

  // Initiate progress for a course
  async initiateProgress(userId: string, courseId: string): Promise<Progress> {
    try {
      const user = await this.studentModel.findById(userId);
      const course = await this.courseModel.findById(courseId);
      if (!user || !course) {
        throw new NotFoundException('User or course not found');
      }
      const progress = new this.progressModel({
        userId,
        courseId,
        level: 'Beginner',
      });
      await progress.save();
      return progress;
    } catch (error) {
      throw new InternalServerErrorException('Error initializing progress');
    }
  }

  // Triggered when a user completes a module's quiz
  async updateProgress(studentId: string, courseId: string): Promise<Progress> {
    try {
      const progress = await this.progressModel.findOne({ userId: studentId, courseId }).exec();
      if (!progress) {
        throw new NotFoundException('Progress record not found');
      }

      if (progress.level === 'Beginner') {
        progress.level = 'Intermediate';
      } else if (progress.level === 'Intermediate') {
        progress.level = 'Advanced';
      } else if (progress.level === 'Advanced') {
        progress.level = 'Expert';
      }

      await progress.save();
      return progress;
    } catch (error) {
      throw new InternalServerErrorException('Error updating progress');
    }
  }

  // Get progress for a user in a course
  async getProgress(userId: string, courseId: string): Promise<Progress> {
    try {
      const userIdObj = new Types.ObjectId(userId);
      const courseIdObj = new Types.ObjectId(courseId);
  
      const progress = await this.progressModel.findOne({ userId: userIdObj, courseId: courseIdObj }).exec();
      
      if (!progress) {
        throw new NotFoundException('Progress record not found');
      }
      return progress;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving progress');
    }
  }
}