import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Date for creation and updates
export class Module {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }], default: [] })
  courses: MongooseSchema.Types.ObjectId[]; // Array of course references

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  resources: string[]; // URLs for multimedia content (videos, PDFs)
}

export type ModuleDocument = Module & Document;
export const ModuleSchema = SchemaFactory.createForClass(Module);


ModuleSchema.index({ title: 'text', content: 'text' });
