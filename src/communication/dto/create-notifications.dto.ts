import { ObjectId } from "mongoose";
import { IsMongoId, IsArray, IsString, IsBoolean } from "class-validator";

export class CreateNotificationDto {
    
    @IsString()
    message: string;

    @IsMongoId()
    recipient: ObjectId;

    @IsBoolean()
    isRead: boolean;
}
