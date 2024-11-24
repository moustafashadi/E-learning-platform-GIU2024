import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Schema as MongooseSchema} from 'mongoose'
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'last_updated' } })
export class Note {
  
  @Prop({type: { type:MongooseSchema.Types.ObjectId , ref:'User' } })
    userId: MongooseSchema.Types.ObjectId;
    
  @Prop({type: { type:MongooseSchema.Types.ObjectId , ref:'Course' } })
    courseId: MongooseSchema.Types.ObjectId;
  
  @Prop({ required: true })
    content: string;

  @Prop({ default: false })
    isPinned: boolean;
}

export type NoteDocument = Note & Document;
export const NotesSchema = SchemaFactory.createForClass(Note);