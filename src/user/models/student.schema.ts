import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "./user.schema";


@Schema()
export class Student extends User {
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Course'}] })
    enrolled_courses: MongooseSchema.Types.ObjectId[];

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Course'}] })
    completed_courses: MongooseSchema.Types.ObjectId[];

    @Prop({default: null})
    averageScore: number;

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Progress'}] })
    Progress: MongooseSchema.Types.ObjectId[];
}

export type StudentDocument = Student & Document;
export const StudentSchema = SchemaFactory.createForClass(Student);