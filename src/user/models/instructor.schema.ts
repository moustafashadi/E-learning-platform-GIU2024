import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Instructor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  specialization: string;
}

export type InstructorDocument = Instructor & Document;
export const InstructorSchema = SchemaFactory.createForClass(Instructor); 