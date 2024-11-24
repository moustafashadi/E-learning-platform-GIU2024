import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Schema as MongooseSchema} from 'mongoose'
import mongoose, { Document} from 'mongoose';
import {Course} from 'src\course\models\course.schema.ts'
import {User} from 'src\User\models\user.schema.ts'
@Schema({ timestamps: { createdAt: 'LastAccessed' } })
export class Progress {

    @Prop({type: { type:MongooseSchema.Types.ObjectId , ref:User } })
    userId: MongooseSchema.Types.ObjectId;

  
    @Prop({type: { type:MongooseSchema.Types.ObjectId , ref:Course } })
    courseId: MongooseSchema.Types.ObjectId;
  
    @Prop({ required: true })
    completionPercentage: number; 
  }
export type ProgressDocument = Progress&Document;
export const ProgressSchema = SchemaFactory.createForClass(Progress);
