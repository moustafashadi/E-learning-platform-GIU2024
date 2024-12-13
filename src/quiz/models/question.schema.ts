import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types } from "mongoose";
import { Document } from "mongoose";

@Schema()
export class Question{
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Quiz'}] })
    quiz: MongooseSchema.Types.ObjectId;

    @Prop({required: true})
    content: string;

    @Prop({required: true})
    correctAnswer: string;

    @Prop()
    hint: string;

    @Prop({required: true})
    difficulty: string; // easy, medium, hard

    @Prop({type : Boolean})
    solved: Boolean;
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);