import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class PerformanceMatrix extends Document {
  @Prop({ required: true, ref: 'Student' })
  studentId: string;

  @Prop({ required: true, ref: 'Module' })
  moduleId: string;

  @Prop({ default: 0 })
  performanceScore: number; // Performance matrix score
}

export const PerformanceMatrixSchema = SchemaFactory.createForClass(PerformanceMatrix);