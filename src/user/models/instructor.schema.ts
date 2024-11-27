import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "./user.schema";

@Schema()
export class Instructor extends User {
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Course'}] })
    createdCourses: MongooseSchema.Types.ObjectId[];

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Analytics'})
    analytics: MongooseSchema.Types.ObjectId;
}

export type InstructorDocument = Instructor & Document;
export const InstructorSchema = SchemaFactory.createForClass(Instructor);