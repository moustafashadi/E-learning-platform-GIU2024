import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';



@Schema({ timestamps: true }) //date4creation und updates
export class Quiz {

  _id: MongooseSchema.Types.ObjectId;

  @Prop({type: {type: MongooseSchema.Types.ObjectId, ref: 'Module'} })
  module_id: MongooseSchema.Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }], default: [] })
  questions: MongooseSchema.Types.ObjectId[];

  //number of questions
  @Prop({ required: true })
  number_of_questions: number;

  //QUIZ
  @Prop({ default: 0})
  quizGrade: number;

  
  //quiz type (multiple choice, true/false, mixed)
  @Prop({ required: true, enum: ['Multiple Choice', 'True/False', 'Mixed'] })
  quiz_type: string;

}



export const QuizSchema = SchemaFactory.createForClass(Quiz);
export type QuizDocument = Quiz & Document;