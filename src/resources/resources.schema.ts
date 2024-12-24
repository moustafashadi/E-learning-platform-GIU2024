//resources uploaded in modules

import { Schema, Prop } from "@nestjs/mongoose";

@Schema({ timestamps: true }) // Date for creation and updates
export class Resource {
    @Prop({ required: true })
    title: string;
    
    @Prop({ required: true })
    file: string[];

    @Prop({ required: true })
    isAvailable: Boolean[];

    @Prop({ required: true })
    versions : number;
}