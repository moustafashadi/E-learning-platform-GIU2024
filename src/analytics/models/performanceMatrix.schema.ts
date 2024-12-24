import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PerformanceMatrix extends Document {
  @Prop({ required: true, ref: 'Student' })
  studentId: string;

  @Prop({ required: true, ref: 'Module' })
  moduleId: string;

  @Prop({ default: 0 })
  performanceScore: number; // Performance matrix score
}


export type PerformanceMatrixDocument = PerformanceMatrix & Document;
export const PerformanceMatrixSchema = SchemaFactory.createForClass(PerformanceMatrix);