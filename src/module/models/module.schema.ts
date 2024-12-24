import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { Resource } from 'src/resources/resources.schema';

@Schema({ timestamps: true }) // Date for creation and updates
export class Module {

  @Prop({ required: true })
  title: string;

  //question bank
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }], default: [] })
  questions: MongooseSchema.Types.ObjectId[];

  @Prop({ type: Object })
  quizBlueprint: {
    number_of_questions: number;
    quiz_type: string;
    //set default value to false
    used: boolean;
  }

  @Prop({ type: [Resource], default: [] })
  resources: Resource[]; // URLs for multimedia content (videos, PDFs)

  //difficulty level
  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty: string;

  //rating
  @Prop({ default: [] })
  rating: number[];
}

export type ModuleDocument = Module & Document;
export const ModuleSchema = SchemaFactory.createForClass(Module);


ModuleSchema.index({ title: 'text' }); // Enable text search on the title field
