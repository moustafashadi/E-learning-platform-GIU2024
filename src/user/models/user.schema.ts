import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true , discriminatorKey: 'role'} ) //date4creation und updates
export class User {
  @Prop({ required: true })
  name: string; 

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; 

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string; 

  @Prop({ type: String, default: null })
  profile_picture_url: string; 

  @Prop({type : [ {type: MongooseSchema.Types.ObjectId, ref: 'Notification'}] })
  Notifications: MongooseSchema.Types.ObjectId[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
