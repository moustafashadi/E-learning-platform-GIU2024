import { Prop , Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "./user.schema";
import { Notification, NotificationSchema } from "../../communication/models/notification.schema";

@Schema()
export class Admin extends User {
    @Prop({type: []})
    SystemLogs: string[];

    @Prop({type: NotificationSchema})
    announcements : Notification[];
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);