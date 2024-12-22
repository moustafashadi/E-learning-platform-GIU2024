import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types } from "mongoose";
import { Document } from "mongoose";

@Schema()
export class Question {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Quiz' })
  quiz: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ["A", "B", "C", "D"], required: true })
  correctAnswer: string;

  @Prop()
  hint: string;

  @Prop({ required: true })
  index: number;
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);