import { Prop , Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "./user.schema";
import { Notification } from "src/notification/models/notification.schema";

@Schema()
export class Admin extends User {
    @Prop({type: []})
    SystemLogs: string[];

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Notification}]})
    announcements : MongooseSchema.Types.ObjectId[];
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);