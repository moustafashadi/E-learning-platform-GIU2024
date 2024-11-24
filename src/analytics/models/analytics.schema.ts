import {Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Document } from "mongoose";

@Schema()
export class Analytics {
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Student'}] })
    student: MongooseSchema.Types.ObjectId;

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Course'}] })
    course: MongooseSchema.Types.ObjectId;

    @Prop({default: []})
    engagementTime: number;
}

export type AnalyticsDocument = Analytics & Document;
export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);