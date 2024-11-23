import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) //date4creation und updates
export class User {
  @Prop({ required: true, unique: true })
  user_id: string;
  @Prop({ required: true })
  name: string; 

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password_hash: string; 

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string; 

  @Prop({ type: String, default: null })
  profile_uicture_url: string; 

}

export const UserSchema = SchemaFactory.createForClass(User);
