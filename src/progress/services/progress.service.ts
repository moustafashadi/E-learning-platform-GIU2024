import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const existingProgress = await this.progressModel.findOne({ userId, courseId });

    if (existingProgress) {
      existingProgress.completionPercentage = completionPercentage;
      return await existingProgress.save();
    }

    const newProgress = new this.progressModel({
      userId,
      courseId,
      completionPercentage,
    });
    return await newProgress.save();
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
  
}
