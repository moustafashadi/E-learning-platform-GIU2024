import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true }) //date4creation und updates
export class Course {
  @Prop({ required: true, unique: true }) //1
  course_id: string; 

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  description: string; 

  @Prop({ required: true })
  category: string; 

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty: string; 

  @Prop({ required: true })
  created_by: string; 
}

export const CourseSchema = SchemaFactory.createForClass(Course);