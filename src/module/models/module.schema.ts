import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { Course } from 'src/course/models/course.schema';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true }) //date4creation und updates
export class Module {
  @Prop({ required: true, unique: true })
  module_id: string; 

  @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Course}], default: []})
  courses: MongooseSchema.Types.ObjectId[]; 

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  content: string; 

  @Prop({ type: [String], default: [] })
  resources: string[]; 
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
