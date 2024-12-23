import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema()
export class Thread {
  // The unique _id is implicit
  // e.g. _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  /**
   * Sub-threads (like replies).
   * We store an array of references to other Thread docs.
   */
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Thread' }],
    default: [],
  })
  threads: Thread[];

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
    createdBy: Types.ObjectId;
    

}

export type ThreadDocument = Thread & Document;
export const ThreadSchema = SchemaFactory.createForClass(Thread);
