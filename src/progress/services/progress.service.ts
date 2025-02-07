import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress, ProgressDocument } from '../models/progress.schema';
import { Student, StudentDocument, User, UserDocument } from 'src/user/models/user.schema';
import { Course, CourseDocument } from 'src/course/models/course.schema';
import { filter } from 'rxjs';
import { Module, ModuleDocument } from 'src/module/models/module.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) { }

  //initiate progress for a module
  async initiateProgress(userId: string, moduleId: string): Promise<Progress> {
    try {
      const user = await this.studentModel.findById(userId);
      const course = await this.moduleModel.findById(moduleId);
      if (!user || !course) {
        throw new Error('User or course not found');
      }
      const progress = new this.progressModel({
        userId,
        moduleId,
        level: 'Beginner',
      });
      await progress.save();
      return progress;
    } catch (error) {
      throw new Error('error initializing progress');
    }
  }

  //triggered when a user completes a module's quiz
  async updateProgress(studentId: string, quizId: string, moduleId: string): Promise<Progress> {
    try {
      const progress = await this.progressModel.findOne({ userId: studentId, moduleId }).exec();
      if (!progress) {
        throw new Error('Progress record not found');
      }
      // calculate progress depending on the number of modules completed

      //if quiz difficulty is 'easy' and user is at 'beginner' level, update progress to 'intermediate'
      if (progress.level === 'Beginner') {
        progress.level = 'Intermediate';
      }
      //if quiz difficulty is 'medium' and user is at 'intermediate' level, update progress to 'advanced'
      else if (progress.level === 'Intermediate') {
        progress.level = 'Advanced';
      }
      //if quiz difficulty is 'hard' and user is at 'advanced' level, update progress to 'expert'
      else if (progress.level === 'Advanced') {
        progress.level = 'Expert';
      }

      await progress.save();
      return progress;
    } catch (error) {
      throw new Error('Error updating progress');
    }


  }



  async getProgress(userId: string, courseId: string): Promise<Progress> {
    const progress = await this.progressModel.findOne({ userId, courseId }).exec();
    if (!progress) {
      throw new Error('Progress record not found');
    }
    return progress;
  }


}
