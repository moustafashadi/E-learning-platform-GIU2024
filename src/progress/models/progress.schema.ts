import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Schema as MongooseSchema} from 'mongoose'
import { Document} from 'mongoose';


// In progress.schema.ts
@Schema({ timestamps: { createdAt: 'LastAccessed' } })
export class Progress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  //module
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Module', required: true })
  moduleId: MongooseSchema.Types.ObjectId;

  //user progress enum
  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced' , 'Expert'] })
  level: string;

}
export type ProgressDocument = Progress&Document;
export const ProgressSchema = SchemaFactory.createForClass(Progress);
