import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Document } from 'mongoose';
import { Module } from 'src/module/models/module.schema';
import { Question } from 'src/question/models/question.schema';



@Schema({ timestamps: true }) //date4creation und updates
export class Quiz {
  @Prop({type: {type: MongooseSchema.Types.ObjectId, ref: Module} })
  module_id: MongooseSchema.Types.ObjectId; 

  @Prop({type: [{type: MongooseSchema.Types.ObjectId , ref: Question}], default: [] })
  questions: MongooseSchema.Types.ObjectId[]; 

  
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
export type QuizDocument = Quiz & Document;