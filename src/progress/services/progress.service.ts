import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress,ProgressDocument } from '../models/progress.schema';
import { User,UserDocument} from 'src/user/models/user.schema';
import { Course,CourseDocument} from 'src/course/models/course.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async trackProgress(userId: string, courseId: string, completionPercentage: number): Promise<Progress> {
    try {
      console.log('Updating progress for:', { userId, courseId, completionPercentage });
      
      const existingProgress = await this.progressModel.findOne({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId)
      });
  
      if (!existingProgress) {
        console.log('No progress found for:', { userId, courseId });
        throw new Error('Progress not found. Please initialize progress first.');
      }
  
      const updatedProgress = await this.progressModel.findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          courseId: new Types.ObjectId(courseId)
        },
        { $set: { completionPercentage } },
        { new: true }
      );
      
      console.log('Updated progress:', updatedProgress);
      return updatedProgress;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  async getProgress(userId: string, courseId: string): Promise<Progress> {
    const progress = await this.progressModel.findOne({ userId, courseId }).exec();
    if (!progress) {
      throw new Error('Progress record not found'); // Throwing a generic error
    }
    return progress;
  }
  

  async getProgressByInstructor(instructorId: string): Promise<any> {
    const instructor = await this.userModel.findById(instructorId).exec();
    if (!instructor || instructor.role !== 'instructor') {
      throw new Error('Only instructors can view student progress'); // Throwing a generic error
    }
  }
  async initializeProgress(userId: string, courseId: string): Promise<Progress> {
    const existingProgress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId)
    });
    
    if (existingProgress) {
      throw new Error('Progress already initialized for this course');
    }
  
    const newProgress = new this.progressModel({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      completionPercentage: 0,
    });
    
    return await newProgress.save();
  }
  
}
