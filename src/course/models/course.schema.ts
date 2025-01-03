import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/models/user.schema';

@Schema({ timestamps: true })
export class Course {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  course_code: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty: string;

  @Prop({
    type: [String],
    default: [],
  })
  resources: string[];
  
  @Prop({ type: [{type : MongooseSchema.Types.ObjectId, ref : 'Forum'}], default: [] })
  forums: MongooseSchema.Types.ObjectId[];

  //number of quizzes
  @Prop({ default: 0 })
  numOfQuizzes: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  instructor: MongooseSchema.Types.ObjectId; 

  //quizzes
  @Prop({ type: [{type : MongooseSchema.Types.ObjectId, ref : 'Quiz'}], default: [] })
  quizzes: MongooseSchema.Types.ObjectId[];

  //array of students
  @Prop({ type: [{type : MongooseSchema.Types.ObjectId, ref : 'User'}], default: [] })
  students: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [String],
    default: [],
  })
  keywords: string[];


}

export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course);

