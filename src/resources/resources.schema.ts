import { Document } from "mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { Schema, Prop } from "@nestjs/mongoose";

@Schema({ timestamps: true }) // Date for creation and updates
export class Resource {
    @Prop({ required: false })
    title: string;

    @Prop({ required: true })
    file: string[];

    @Prop({ required: true })
    isAvailable: Boolean[];

    @Prop({ required: false })
    versions : number;
}

export type ResourceDocument = Resource & Document;
export const ResourceSchema = SchemaFactory.createForClass(Resource);