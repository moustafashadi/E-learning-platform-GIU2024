import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ForumDocument = Forum & Document;

@Schema({ timestamps: true })
export class Forum {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], required: true })
  course: Types.ObjectId;

  @Prop({type: [{type:Types.ObjectId, ref:'Thread'}]})
  threads: Types.ObjectId[];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: String }] })
  tags: string[];
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
