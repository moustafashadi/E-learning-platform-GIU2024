import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true }) //date4creation und updates
export class Quiz {
  @Prop({type: {type: MongooseSchema.Types.ObjectId, ref: 'Module'} })
  module_id: MongooseSchema.Types.ObjectId; 

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true})
  course: MongooseSchema.Types.ObjectId;

  @Prop({type: [{type: MongooseSchema.Types.ObjectId , ref: 'Question'}], default: [] })
  questions: MongooseSchema.Types.ObjectId[]; 

  
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
export type QuizDocument = Quiz & Document;