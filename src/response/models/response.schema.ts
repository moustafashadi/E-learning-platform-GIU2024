import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {  Document, Mongoose} from 'mongoose';
import {Schema as MongooseSchema} from 'mongoose'
import {User} from 'src\user\models\user.schema.ts'
import {Quiz} from 'src\quiz\models\quiz.schema.ts'
@Schema({ timestamps: { createdAt: 'submitted_at' } })

export class Responses{
    
    @Prop({type: { type:MongooseSchema.Types.ObjectId , ref:User } })
    userId: MongooseSchema.Types.ObjectId;

    @Prop( {type: { type:MongooseSchema.Types.ObjectId , ref:Quiz }})
    QuizId: MongooseSchema.Types.ObjectId;

    @Prop({ type: [{ type: Object }] })
    answers: Array<object>;

    @Prop({required:true})
    score: number;
}
export type responsesDocument = Responses & Document;
export const responsesSchema = SchemaFactory.createForClass(Responses);
