import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {  Document, Mongoose} from 'mongoose';
import {Schema as MongooseSchema} from 'mongoose'

@Schema({ timestamps: { createdAt: 'submitted_at' } })

export class Response{
    
    @Prop({type: { type:MongooseSchema.Types.ObjectId , ref: 'User' } })
    userId: MongooseSchema.Types.ObjectId;

    @Prop( {type: { type:MongooseSchema.Types.ObjectId , ref: 'Quiz' }})
    QuizId: MongooseSchema.Types.ObjectId;

    @Prop({type: { type:MongooseSchema.Types.ObjectId , ref: 'Question' }})
    questionId: MongooseSchema.Types.ObjectId;

    @Prop({required:true})
    score: number;

    //feedback message
    @Prop()
    feedbackMessage: string;
}
export type ResponseDocument = Response & Document;
export const ResponseSchema = SchemaFactory.createForClass(Response);
