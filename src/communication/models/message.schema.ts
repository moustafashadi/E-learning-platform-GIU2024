import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type messageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Chat' }], required: true })
    chat: Types.ObjectId[];

    @Prop({ required: true })
    message: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Message);
