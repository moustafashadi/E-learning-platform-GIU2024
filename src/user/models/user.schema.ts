import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Base User Schema
@Schema({ timestamps: true, discriminatorKey: 'role' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: '' })
  profilePicUrl: string;

  @Prop({enum: ['admin', 'student', 'instructor'], default: 'student' })
  role: String;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Notification' }], default: [] })
  notifications: MongooseSchema.Types.ObjectId[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Admin Schema
@Schema()
export class Admin extends User {}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);

// Student Schema
@Schema()
export class Student extends User {

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }], default: [] })
  enrolledCourses: MongooseSchema.Types.ObjectId[]; // List of course IDs the student is enrolled in

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }], default: [] })
  completedCourses: MongooseSchema.Types.ObjectId[]; // List of course IDs the student completed


}

export type StudentDocument = Student & Document;
export const StudentSchema = SchemaFactory.createForClass(Student);

// Instructor Schema
@Schema()
export class Instructor extends User {
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }], default: [] })
  coursesTaught: MongooseSchema.Types.ObjectId[]; // List of course IDs the instructor teaches
}

export type InstructorDocument = Instructor & Document;
export const InstructorSchema = SchemaFactory.createForClass(Instructor);

// NestJS Discriminator Registration
export const schemas = [
  { name: 'Admin', schema: AdminSchema },
  { name: 'Student', schema: StudentSchema },
  { name: 'Instructor', schema: InstructorSchema },
];

