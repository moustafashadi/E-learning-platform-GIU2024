import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) //date for creation und updates
export class Course {
  @Prop({ required: true, unique: true }) //1
  course_code: string; 

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  description: string; 

  @Prop({ required: true })
  category: string; 

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty: string; 

  @Prop({type: {type: MongooseSchema.Types.ObjectId, ref: 'User'}})
  created_by: MongooseSchema.Types.ObjectId; 
}



export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course);