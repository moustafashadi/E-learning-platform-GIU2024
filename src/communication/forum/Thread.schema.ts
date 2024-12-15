import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ThreadDocument = Thread & Document;
@Schema({ timestamps: true })
export class Thread {
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Forum' }], required: true })
    forum: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], required: true })
    messages: Types.ObjectId[];

    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    createdBy: Types.ObjectId;
    
    @Prop({ default: [] })
    replies: String[];
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
