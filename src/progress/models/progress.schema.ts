import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Schema as MongooseSchema} from 'mongoose'
import { Document} from 'mongoose';


// In progress.schema.ts
@Schema({ timestamps: { createdAt: 'LastAccessed' } })
export class Progress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 0 })
  completionPercentage: number;
}
export type ProgressDocument = Progress&Document;
export const ProgressSchema = SchemaFactory.createForClass(Progress);
