import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress,ProgressDocument } from '../models/progress.schema';
import { Student, StudentDocument, User,UserDocument} from 'src/user/models/user.schema';
import { Course,CourseDocument} from 'src/course/models/course.schema';
import { filter } from 'rxjs';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel(Student.name) private studentModal: Model<StudentDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  //update progress
  // async updateProgress(userId: string, courseId: string) {
  //   console.log("sid "+userId);
  //   const user = await this.studentModal.findById(userId);
  //   console.log("bid "+courseId);
  //   const course = await this.courseModel.findById(courseId);
  //   if (!user || !course) {
  //     throw new Error('User or course not found');
  //   }
  //   const progress = await this.progressModel.findOne({ userId, courseId }).exec();
  //   if (!progress) {
  //     throw new Error('Progress record not found');
  //   }

  //   const unfilteredSolvedQuizzesIds = Array.from(user.quizGrades.keys());

  //   const courseQuizzesIds = course.quizzes;

  //   const parsedCourseQuizzesIds = courseQuizzesIds.map((quizId) => quizId.toString());

  //   const solvedQuizzesIds = unfilteredSolvedQuizzesIds.filter((quizId) => parsedCourseQuizzesIds.includes(quizId));
    

  //   progress.completionPercentage = (solvedQuizzesIds.length / courseQuizzesIds.length) * 100;
  //   await progress.save();
  //   return progress
  // }
    


  async getProgress(userId: string, courseId: string): Promise<Progress> {
    const progress = await this.progressModel.findOne({ userId, courseId }).exec();
    if (!progress) {
      throw new Error('Progress record not found'); // Throwing a generic error
    }
    return progress;
  }

  
}
