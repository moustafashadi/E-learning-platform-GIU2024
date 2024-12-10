import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema()
export class Response {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  questionId: string;

  @Prop({ type: String, required: true })
  chosenAnswer: string;

  @Prop({ type: Boolean, default: false })
  isCorrect: boolean;

  @Prop({ type: String, default: '' })
  feedbackMessage: string;

  @Prop({ type: Date, default: Date.now })
  answeredAt: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
