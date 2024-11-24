import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true }) //date4creation und updates
export class Quiz {
  @Prop({ required: true, unique: true })
  quiz_id: string; 

  @Prop({ required: true })
  module_id: string; 

  @Prop({ type: [Object], default: [] })
  questions: Object[]; 

  
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
