import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Question } from './question.schema';



@Schema({ timestamps: true }) //date4creation und updates
export class Quiz {

  _id: MongooseSchema.Types.ObjectId;

  @Prop({type: {type: MongooseSchema.Types.ObjectId, ref: 'Module'} })
  moduleId: MongooseSchema.Types.ObjectId; 

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }], default: [] })
  questions: Question[];

  //number of questions
  @Prop({ required: true })
  number_of_questions: number;

  //QUIZ
  @Prop({ default: 0})
  quizGrade: number;

  //chosen answers
  @Prop({ default: [] })
  chosenAnswers: string[];

  //quiz type (multiple choice, true/false, mixed)
  @Prop({ required: true, enum: ['Multiple Choice', 'True/False', 'Mixed'] })
  quiz_type: string;

  //quiz status (done, in progress)
  @Prop({ default: 'in progress' , enum: ['done', 'in progress'] })
  status: string;

}



export const QuizSchema = SchemaFactory.createForClass(Quiz);
export type QuizDocument = Quiz & Document;