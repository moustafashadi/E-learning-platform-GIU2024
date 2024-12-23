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

  // The single correct choice among A, B, C, D
  @Prop({ enum: ["A", "B", "C", "D"], required: true })
  correctAnswer: string;

  @Prop()
  hint: string;

  @Prop({ required: true })
  index: number;

  /**
   * Store multiple-choice options as an array,
   * e.g. [ { text: "...", identifier: "A" }, ... ]
   */
  @Prop({
    type: [
      {
        text: { type: String, required: true },
        identifier: { type: String, required: true },
      },
    ],
    default: [],
  })
  options: { text: string; identifier: string }[];
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);
