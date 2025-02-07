import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'submitted_at' } })
export class Response extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
    quizId: Types.ObjectId;

    @Prop()
    feedbackMessage: string;
}

export type ResponseDocument = Response & Document;
export const ResponseSchema = SchemaFactory.createForClass(Response);