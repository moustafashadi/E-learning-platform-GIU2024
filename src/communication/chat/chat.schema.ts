import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  @Prop({type: [{type:  Types.ObjectId, ref: 'Message' }], required: true })
  messages: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId;

  @Prop({ required:true, default:"" })
  title:String;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);