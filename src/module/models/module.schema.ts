import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true }) //date4creation und updates
export class Module {
  @Prop({ required: true, unique: true })
  module_id: string; 

  @Prop({ required: true })
  course_id: string; 

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  content: string; 

  @Prop({ type: [String], default: [] })
  resources: string[]; 
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
