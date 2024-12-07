import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Schema as MongooseSchema} from 'mongoose'
import { Document} from 'mongoose';


@Schema({ timestamps: { createdAt: 'LastAccessed' } })
export class Progress {

    @Prop({type: { type:MongooseSchema.Types.ObjectId , ref: 'User' } })
    userId: MongooseSchema.Types.ObjectId;

  
    @Prop({type: { type:MongooseSchema.Types.ObjectId , ref: 'Course' } })
    courseId: MongooseSchema.Types.ObjectId;
  
    @Prop({ required: true })
    completionPercentage: number; 
  }
export type ProgressDocument = Progress&Document;
export const ProgressSchema = SchemaFactory.createForClass(Progress);
