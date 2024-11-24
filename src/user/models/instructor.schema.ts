import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "./user.schema";
import { Course } from "src/course/models/course.schema";
import { analytics } "src/analytics/models/analytics.schema";

@Schema()
export class Instructor extends User {
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Course}] })
    createdCourses: MongooseSchema.Types.ObjectId[];

    @Prop({type: MongooseSchema.Types.ObjectId, ref: analytics})
    analytics: MongooseSchema.Types.ObjectId;
}

export type InstructorDocument = Instructor & Document;
export const InstructorSchema = SchemaFactory.createForClass(Instructor);