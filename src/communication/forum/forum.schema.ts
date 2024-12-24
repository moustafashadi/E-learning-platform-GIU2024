import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/models/user.schema';
import { Thread } from './Thread.schema';


@Schema({ timestamps: true })
export class Forum {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], required: true })
  course: Types.ObjectId;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Thread' }],
    default: [],
  })
  threads: Thread[];


  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true, enum: ['Helpful', 'Frequent Questions', 'Question', 'Answer', 'Announcement'] })
  tag: string;

  //forums
  @Prop({ type: [{type : MongooseSchema.Types.ObjectId, ref : 'Forum'}], default: [] })
  forums: MongooseSchema.Types.ObjectId[];

    //forums
    @Prop({ type: [{type : MongooseSchema.Types.ObjectId, ref : 'Thread'}], default: [] })
    thread: MongooseSchema.Types.ObjectId[];

}

export type ForumDocument = Forum & Document;
export const ForumSchema = SchemaFactory.createForClass(Forum);
