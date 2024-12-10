import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Note extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  last_updated: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
export type NoteDocument = Note & Document;