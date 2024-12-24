import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/models/user.schema';

@Schema({ timestamps: true })
export class Course {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  //keywords
  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  instructor: MongooseSchema.Types.ObjectId; 

  //array of students
  @Prop({ type: [{type : MongooseSchema.Types.ObjectId, ref : 'User'}], default: [] })
  students: MongooseSchema.Types.ObjectId[];

  //modules
  @Prop({ type: [{type : MongooseSchema.Types.ObjectId, ref : 'Module'}], default: [] })
  modules: MongooseSchema.Types.ObjectId[];

  //forums
  @Prop({ type: [{type : MongooseSchema.Types.ObjectId, ref : 'Forum'}], default: [] })
  forums: MongooseSchema.Types.ObjectId[];

  //availability
  @Prop({ required: true, enum: ['Public', 'Private'] })
  availability: string;

  //rating
  @Prop({ default: 0 })
  rating: number;

  @Prop({
    type: [String],
    default: [],
  })
  keywords: string[];


}

export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course);

//enable text search on the title field
CourseSchema.index({ title: 'text' , keywords: 'text' });
